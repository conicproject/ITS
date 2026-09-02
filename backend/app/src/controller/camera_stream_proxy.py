# backend/app/src/controller/camera_stream_proxy.py
"""
Reverse proxy สำหรับหน้า go2rtc stream viewer (private IP ในวง LAN) ให้ serve
ผ่าน backend domain public ของเราเอง — กัน browser ยิงตรงไปหา private IP
ไม่ได้ (unreachable จากนอก LAN) โดยไม่ต้องเปิดพอร์ต 1984 ออก internet เลย

ต่างจาก image_proxy.py ตรงที่หน้า stream.html เป็นเว็บเพจที่โหลด asset อื่น
ต่อ (js/css) และเปิด WebSocket ค้างไว้เพื่อรับข้อมูลวิดีโอแบบ MSE ดังนั้นต้อง
proxy แบบ "catch-all" ทุก path ใต้ /camera-stream/ ทั้ง HTTP และ WebSocket

ใช้กับ:
  <iframe src="/api/camera-stream/stream.html?src=cam_01_siha-in_c1(2)">
แทนการยิง URL กล้องตรง ๆ (http://10.142.1.123:1984/...)

หมายเหตุสำคัญ: ถ้า backend ตัวนี้ถูกวางไว้หลัง reverse proxy อีกชั้น (nginx/caddy
ฯลฯ) ต้อง set header อัปเกรดให้ผ่านด้วย ไม่งั้น WebSocket handshake จะไม่ถึง
uvicorn เลย (browser จะเห็น response ว่างเปล่า ไม่มี Sec-WebSocket-Accept):
    location /api/ {
        proxy_pass http://127.0.0.1:5410;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
"""

import asyncio
import logging

import httpx
import websockets
from fastapi import HTTPException, Request, Response, WebSocket, WebSocketDisconnect
from websockets.exceptions import ConnectionClosed

logger = logging.getLogger(__name__)

# อนุญาตเฉพาะเครื่องกล้องเท่านั้น กัน SSRF (ไม่ให้ proxy ไปดึงที่อื่นได้ตามใจ)
CAMERA_HOST = "10.142.1.123"
CAMERA_PORT = 1984
CAMERA_HTTP_BASE = f"http://{CAMERA_HOST}:{CAMERA_PORT}"
CAMERA_WS_BASE = f"ws://{CAMERA_HOST}:{CAMERA_PORT}"

# headers ที่ไม่ควร forward ต่อ (hop-by-hop / จะขัดกับ response ที่ประกอบใหม่)
_STRIP_REQUEST_HEADERS = {"host", "connection", "content-length"}
_STRIP_RESPONSE_HEADERS = {
    "content-encoding",
    "content-length",
    "transfer-encoding",
    "connection",
}


class CameraStreamProxyController:

    # ================== HTTP: stream.html, .js, .css, mjpeg ฯลฯ ==================
    async def proxy_http(self, path: str, request: Request):
        target_url = f"{CAMERA_HTTP_BASE}/{path}"

        forward_headers = {
            k: v for k, v in request.headers.items() if k.lower() not in _STRIP_REQUEST_HEADERS
        }
        body = await request.body()

        try:
            client = httpx.AsyncClient(timeout=15)
            req = client.build_request(
                request.method,
                target_url,
                params=request.query_params,
                headers=forward_headers,
                content=body,
            )
            upstream = await client.send(req, stream=True)
        except httpx.RequestError:
            logger.exception(f"camera_stream_proxy failed to reach {target_url}")
            raise HTTPException(status_code=502, detail="failed to reach camera server")

        content = b""
        async for chunk in upstream.aiter_bytes():
            content += chunk
        await upstream.aclose()
        await client.aclose()

        response_headers = {
            k: v for k, v in upstream.headers.items() if k.lower() not in _STRIP_RESPONSE_HEADERS
        }

        return Response(
            content=content,
            status_code=upstream.status_code,
            headers=response_headers,
            media_type=upstream.headers.get("content-type"),
        )

    # ================== WebSocket: /api/ws?src=... (MSE video data) ==================
    async def proxy_websocket(self, path: str, websocket: WebSocket):
        query = websocket.url.query
        target_url = f"{CAMERA_WS_BASE}/{path}" + (f"?{query}" if query else "")

        # เชื่อมกล้องให้ติดก่อนค่อย accept ฝั่ง browser — ถ้ากล้องต่อไม่ติด
        # จะได้ปิด connection ด้วย code ที่สื่อความหมาย แทนที่จะ accept แล้ว
        # ค้างเงียบ ๆ ให้ browser งงว่าทำไมไม่มีวิดีโอ
        try:
            upstream_ws = await websockets.connect(target_url, open_timeout=10)
        except Exception:
            logger.exception(f"camera_stream_proxy: failed to reach upstream {target_url}")
            await websocket.close(code=1011)
            return

        await websocket.accept()

        try:
            async def client_to_upstream():
                try:
                    while True:
                        msg = await websocket.receive()
                        if msg["type"] == "websocket.disconnect":
                            break
                        if "text" in msg and msg["text"] is not None:
                            await upstream_ws.send(msg["text"])
                        elif "bytes" in msg and msg["bytes"] is not None:
                            await upstream_ws.send(msg["bytes"])
                except (WebSocketDisconnect, ConnectionClosed):
                    pass

            async def upstream_to_client():
                try:
                    async for message in upstream_ws:
                        if isinstance(message, bytes):
                            await websocket.send_bytes(message)
                        else:
                            await websocket.send_text(message)
                except (WebSocketDisconnect, ConnectionClosed):
                    pass

            done, pending = await asyncio.wait(
                [asyncio.create_task(client_to_upstream()), asyncio.create_task(upstream_to_client())],
                return_when=asyncio.FIRST_COMPLETED,
            )
            for task in pending:
                task.cancel()

        except Exception:
            logger.exception(f"camera_stream_proxy websocket failed for {target_url}")
        finally:
            try:
                await upstream_ws.close()
            except Exception:
                pass
            try:
                await websocket.close()
            except Exception:
                pass