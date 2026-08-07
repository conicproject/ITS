#NoEnv
#SingleInstance Force
#MaxThreadsPerHotkey 2
SendMode Input

running := false
waiting := false
clickCount := 0
currentCount := 0
state := 0
posX := 0
posY := 0

;==========================
; Alt เริ่ม/หยุด
;==========================
~Alt::
if (running)
{
    running := false
    waiting := false
    SetTimer, AutoClick, Off
    Click Up
    ToolTip STOP
    SetTimer, RemoveTT, -1000
    return
}

InputBox, clickCount, Auto Click, ใส่จำนวนครั้งที่ต้องการคลิก

if (ErrorLevel || clickCount <= 0)
    return

waiting := true

ToolTip เลื่อนเมาส์ไปตำแหน่งที่ต้องการ`nแล้วกด Enter
return

;==========================
; Enter = ยืนยันตำแหน่ง
;==========================
Enter::
if (!waiting)
{
    Send {Enter}
    return
}

waiting := false

MouseGetPos, posX, posY

currentCount := 0
state := 0
running := true

ToolTip START
SetTimer, AutoClick, -10
return

;==========================
; Macro Q = Toggle Auto Click
;==========================
autoQ := false

*$q::
autoQ := !autoQ

if (autoQ)
{
    ToolTip Auto Q : ON
    SetTimer, AutoQClick, 10
}
else
{
    ToolTip Auto Q : OFF
    SetTimer, AutoQClick, Off
    Click Up
}

SetTimer, RemoveTT, -1000
return

AutoQClick:
Click Down
Sleep 10
Click Up
Sleep 10
return


;==========================
; Auto Click
;==========================
AutoClick:

if (!running)
    return

if (currentCount >= clickCount)
{
    running := false
    Click Up
    ToolTip DONE
    SetTimer, RemoveTT, -1500
    return
}

MouseMove, %posX%, %posY%, 0

Click Down
Sleep 400

if (!running)
{
    Click Up
    return
}

Click Up
Sleep 400

currentCount++

ToolTip % "Auto Click : " currentCount " / " clickCount

SetTimer, AutoClick, -10
return

;==========================
; ลบ ToolTip
;==========================
RemoveTT:
ToolTip
return

;==========================
; F1 = Toggle Auto Space
;==========================
autoSpace := false

z::
autoSpace := !autoSpace

if (autoSpace)
{
    ToolTip Auto Space : ON
    SendInput {Space}          ; กดทันที 1 ครั้ง
    SetTimer, AutoSpace, 1000  ; จากนั้นทุก 1 วินาที
}
else
{
    ToolTip Auto Space : OFF
    SetTimer, AutoSpace, Off
}

SetTimer, RemoveTT, -1000
return

AutoSpace:
SendInput {Space down}
Sleep 30
SendInput {Space up}
return
