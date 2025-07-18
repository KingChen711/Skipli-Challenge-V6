FROM public.ecr.aws/lambda/nodejs:20

# Sao chép các file riêng lẻ
COPY package*.json dist/src /var/task/

# Sao chép TOÀN BỘ thư mục models (giữ nguyên cấu trúc)
COPY models /var/task/models

RUN npm ci --only=production

CMD ["index.handler"]