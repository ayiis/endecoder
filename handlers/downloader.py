import q
import time
import codecs
from urllib.parse import unquote, quote
from common import tool
import shutil
import ubelt
import asyncio
import uuid

# download_cmd = "python3 /mine/github/coding/downloader/app.py"
# save_path = "/tmp/tmp/"

download_cmd = "python3 /opt/downloader/app.py"
save_path = "/opt/nginx-1.10.0/aydocs/downloader/"

dustbin = "/tmp/"

downloader_path = "https://wodove.com/aydocs/downloader/"
task_cache = {}


async def download_url(req_data):

    ubelt.ensuredir(save_path)

    target_url = req_data["target_url"]
    file_name = uuid.uuid4().hex

    if not target_url:
        raise Exception("请输入正确的URL")

    cache_to_name = "%s.%s" % (save_path, file_name)
    store_to_name = "%s%s" % (save_path, file_name)

    if task_cache.get(file_name):
        if not task_cache[file_name].get("status"):
            return ""

    async def do():

        cmd = "%s \"%s\" -o=\"%s\"" % (
            download_cmd,
            target_url,
            cache_to_name
        )

        print("cmd:", cmd)

        res = await tool.execute_command(cmd)
        print(res)

        shutil.move(cache_to_name, store_to_name)
        task_cache[file_name]["status"] = True

    def clear_one(file_name):

        print("clear_one..", file_name)

        if file_name in task_cache:
            shutil.move(task_cache[file_name]["store_to_name"], dustbin)
            del task_cache[file_name]

    task_cache[file_name] = {
        "status": False,
        "file_name": file_name,
        "cache_to_name": cache_to_name,
        "store_to_name": store_to_name,
    }
    loop = asyncio.get_event_loop()
    loop.create_task(do())

    # 6小时后自动删除下载的文件
    tool.loop_run_at(timeout=60 * 60 * 6, func=clear_one, args=(file_name, ))

    return file_name


async def get_download_status(req_data):

    job = task_cache.get(req_data["file_name"]) or {}

    if not job.get("status"):
        return ""

    download_link = "%s%s" % (downloader_path, job["file_name"])

    return download_link
