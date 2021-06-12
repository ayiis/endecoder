import asyncio
import q


async def execute_command(command, encoding="utf8"):
    proc = await asyncio.create_subprocess_shell(
        command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    out, err = await proc.communicate()
    return (out or err).decode(encoding)


async def test_tool():
    res = await execute_command("netstat -ano")
    q.d()
    print(res)


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(test_tool())
