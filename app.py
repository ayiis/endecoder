#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# __author__ = "ayiis"
# create on 2020/08/11
import asyncio
import aiohttp.web


async def main():

    # 初始化 jade 页面
    from common.build import JadeWork
    templete = JadeWork.build("src", "src_html")

    # 启动 web 服务
    from handlers import ApiHandler, TemplateHandler
    from handlers import endecode, downloader

    app = aiohttp.web.Application()
    ApiHandler.add_handlers({
        "/api/encode": endecode.encode,
        "/api/decode": endecode.decode,
        "/api/download_url": downloader.download_url,
        "/api/get_download_status": downloader.get_download_status,
    })

    app.router.add_static("/static/", path="./static/", name="static")  # 静态资源 js css img (下载形式)
    app.router.add_route("POST", "/api/{match:.*}", ApiHandler.do)      # API 接口
    app.router.add_route("GET", "/{match:.*}", TemplateHandler.wrap("src", templete, index="index"))   # html 页面

    await asyncio.gather(
        aiohttp.web._run_app(app, port=7001),   # 启动web服务，监听端口
    )


if __name__ == "__main__":

    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
