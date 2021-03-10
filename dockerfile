
# 在这里查找想要的TAG: https://hub.docker.com/_/python?tab=tags
FROM python:3.7

# 在容器里使用(或创建)一个工作目录
WORKDIR /work

# 将当前目录内容复制到容器的 /work
ADD . /work

# 更新 apt
# RUN apt-get update
# RUN apt-get install build-essential -y
RUN pwd
RUN ls -al

# 安装 requirements.txt 中指定的任何所需软件包
# 要注意，包的版本应当适应于 docker 环境，或者不指定版本
RUN pip install -r ./requirements.txt -i https://mirrors.aliyun.com/pypi/simple/

# 定义环境变量
# ENV key value

# 在容器启动时运行 app.py
CMD ["python", "./app.py", "--port", "7001"]

