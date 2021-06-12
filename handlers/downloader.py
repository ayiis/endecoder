import q
import time
import codecs
from urllib.parse import unquote, quote
from common import tool
import shutil
import ubelt
import asyncio

# download_cmd = "python3 /mine/github/coding/downloader/app.py"
# save_path = "/tmp/tmp/"

download_cmd = "python3 /opt/downloader/app.py"
save_path = "/opt/nginx-1.10.0/aydocs"
downloader_path = "http://ayiis.me/aydocs/downloader/"
task_cache = {}


async def download_url(req_data):

    ubelt.ensuredir(save_path)

    target_url = req_data["target_url"]
    file_name = req_data["save_to_name"].replace("/", "_").replace(".", "_")
    cache_to_name = "%s.%s" % (save_path, file_name)
    store_to_name = "%s%s" % (save_path, file_name)

    if task_cache.get(req_data["save_to_name"]):
        if not task_cache[req_data["save_to_name"]].get("status"):
            return ""

    async def do():

        res = await tool.execute_command(
            "%s \"%s\" -o=\"%s\"" % (
                download_cmd,
                target_url,
                cache_to_name
            )
        )
        print(res)

        shutil.move(cache_to_name, store_to_name)
        task_cache[req_data["save_to_name"]]["status"] = True

        return None

    task_cache[req_data["save_to_name"]] = {
        "status": False,
        "file_name": file_name,
        "cache_to_name": cache_to_name,
        "store_to_name": store_to_name,
    }
    loop = asyncio.get_event_loop()
    loop.create_task(do())

    return ""


async def get_download_status(req_data):

    job = task_cache.get(req_data["save_to_name"]) or {}

    if not job.get("status"):
        return ""

    download_link = "%s%s" % (downloader_path, job["file_name"])

    return download_link
