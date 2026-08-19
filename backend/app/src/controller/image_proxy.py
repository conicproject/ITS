# backend/app/src/controller/image_proxy.py
"""
Proxy สำหรับดึงรูปจากกล้อง (private IP ในวง LAN) แล้ว serve กลับผ่าน backend
domain public ของเราเอง — กัน browser ยิงตรงไปหา private IP ไม่ได้ (unreachable
จากนอก LAN) และกัน mixed-content ถ้าเว็บรันเป็น https

ใช้กับ <img src="/api/image-proxy?url=..."> แทนการใช้ URL กล้องตรงๆ
"""

import logging

import httpx
from fastapi import HTTPException, Response

logger = logging.getLogger(__name__)

# อนุญาตเฉพาะ host ของกล้องเท่านั้น กัน SSRF (ไม่ให้ proxy ไปดึง URL อื่นได้ตามใจ)
ALLOWED_IMAGE_HOSTS = [
    "10.110.1.12",
]


class ImageProxyController:

    async def get_image_proxy(self, url: str):
        if not url or not any(host in url for host in ALLOWED_IMAGE_HOSTS):
            raise HTTPException(status_code=400, detail="invalid or disallowed host")

        try:
            async with httpx.AsyncClient(verify=False, timeout=10, follow_redirects=True) as client:
                resp = await client.get(url)

            if resp.status_code != 200:
                raise HTTPException(
                    status_code=502,
                    detail=f"upstream returned {resp.status_code}",
                )

            return Response(
                content=resp.content,
                media_type=resp.headers.get("content-type", "image/jpeg"),
                headers={"Cache-Control": "public, max-age=3600"},
            )

        except httpx.RequestError:
            logger.exception(f"image_proxy failed to fetch {url}")
            raise HTTPException(status_code=502, detail="failed to fetch upstream image")