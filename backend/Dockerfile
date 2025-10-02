FROM python:3.9-slim

# ติดตั้ง dependencies ที่จำเป็น
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    libaio-dev \
    tzdata \
    libpq-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && ln -s /usr/lib/x86_64-linux-gnu/libaio.so /usr/lib/x86_64-linux-gnu/libaio.so.1

# Oracle Instant Client (ใช้ thick mode)
RUN mkdir -p /opt/oracle
WORKDIR /opt/oracle

RUN wget https://download.oracle.com/otn_software/linux/instantclient/1923000/instantclient-basic-linux.x64-19.23.0.0.0dbru.zip \
    && unzip instantclient-basic-linux.x64-19.23.0.0.0dbru.zip \
    && rm instantclient-basic-linux.x64-19.23.0.0.0dbru.zip

ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_19_23:$LD_LIBRARY_PATH
ENV PATH=/opt/oracle/instantclient_19_23:$PATH

# ตั้ง working dir สำหรับ app
WORKDIR /app

# ติดตั้ง dependencies ของ Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# คัดลอก source code
COPY . .

# ตั้ง timezone
ENV TZ=Asia/Bangkok
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Expose port
EXPOSE 50001

# สร้าง user ธรรมดา
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# ให้ Python มองหา code ใน /app/app
ENV PYTHONPATH=/app/app

# Run server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "50001", "--reload"]
