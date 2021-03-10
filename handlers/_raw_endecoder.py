import q
import codecs
import hashlib
import base64
from urllib.parse import unquote, quote
import zhconv
import html


def default_encoder(in_text, in_byte, encoding_to, encoding_from):

    return codecs.decode(in_byte, encoding_to, "replace")


def md5_encoder_32(in_text, in_byte, encoding_to, encoding_from):

    return hashlib.md5(in_byte).digest().hex()


def md5_encoder_16(in_text, in_byte, encoding_to, encoding_from):

    return md5_encoder_32(in_text, in_byte, encoding_to, encoding_from)[8:24]


def base64_encoder(in_text, in_byte, encoding_to, encoding_from):

    return codecs.decode(base64.b64encode(in_byte))


def url_char_encoder(in_text, in_byte, encoding_to, encoding_from):

    return quote(in_byte)


def url_encoder(in_text, in_byte, encoding_to, encoding_from):

    hex_text = in_byte.hex().upper()
    return "".join(["%%%s" % hex_text[x * 2: x * 2 + 2] for x in range(len(hex_text) // 2)])


def chinese_s2t(in_text, in_byte, encoding_to, encoding_from):

    return zhconv.convert(in_text, "zh-tw")


def hex_encoder(in_text, in_byte, encoding_to, encoding_from):

    return codecs.decode(codecs.encode(in_byte, "hex_codec"))


def hexx_encoder(in_text, in_byte, encoding_to, encoding_from):

    return "".join("\\x{:02x}".format(c) for c in in_byte)


def html_encode(in_text, in_byte, encoding_to, encoding_from):

    return html.escape(in_text)


def html_hex_encode(in_text, in_byte, encoding_to, encoding_from):

    return "".join("&#x%s;" % format(ord(c), "x") for c in in_text)


def html_dec_encode(in_text, in_byte, encoding_to, encoding_from):

    return "".join("&#%s;" % ord(c) for c in in_text)


def js_ascii_oct_encode(in_text, in_byte, encoding_to, encoding_from):

    return "".join("\\%s" % format(ord(c), "o") for c in in_text)


def js_ascii_hex_encode(in_text, in_byte, encoding_to, encoding_from):

    return "".join("\\x%s" % format(ord(c), "x") for c in in_text)


def unicode_s_encode(in_text, in_byte, encoding_to, encoding_from):

    return "".join("\\u{:04x}".format(ord(c)) for c in in_text)


def unicode_u_encode(in_text, in_byte, encoding_to, encoding_from):

    return "".join("%u{:04x}".format(ord(c)) for c in in_text)


def international_encode(in_text, in_byte, encoding_to, encoding_from):

    return ",".join(["".join(["{:02x}".format(x - 0x80) for x in codecs.encode(c, encoding_from, "replace")]) for c in in_text])


def utf7_encode(in_text, in_byte, encoding_to, encoding_from):

    bin1 = "".join("{:016b}".format(ord(c)) for c in in_text)
    bin1 = bin1 + "0" * ((6 - len(bin1) % 6) % 6)

    res = ""
    for x in range(len(bin1) // 6):
        s = int(bin1[x * 6: x * 6 + 6], 2)
        if s == 63:
            c = "/"
        elif s == 62:
            c = "+"
        elif 52 <= s:
            c = chr(ord("0") + s - 52)
        elif 26 <= s:
            c = chr(ord("a") + s - 26)
        else:
            c = chr(ord("A") + s)

        res = res + c

    return "+%s-" % (res)


def machine_encode(in_text, in_byte, encoding_to, encoding_from):

    return ",".join([str(int(codecs.encode(t, encoding_from, "replace").hex(), 16)) for t in in_text])


def war3_s2ih(in_text, in_byte, encoding_to, encoding_from):
    res = 0
    for c in in_text:
        res = res << 8 | ord(c)

    return "%s, %s" % (res, hex(res))


def war3_ih2s(in_text, in_byte, encoding_to, encoding_from):

    in_text = in_text.split(",")[0].strip()
    i = int(in_text, 16) if "0x" in in_text else int(in_text)
    res = ""

    while i > 0:
        i, c = divmod(i, 256)
        res = chr(c) + res

    return res


"""
    解 码
"""


def default_decoder(out_text, out_byte, encoding_from, encoding_to):

    return codecs.decode(out_byte, encoding_from, "replace")


def base64_decoder(out_text, out_byte, encoding_from, encoding_to):

    return codecs.decode(base64.b64decode(out_byte), encoding_from, "replace")


def url_decoder(out_text, out_byte, encoding_from, encoding_to):

    return unquote(out_text, encoding=encoding_from)


def chinese_t2s(out_text, out_byte, encoding_from, encoding_to):

    return zhconv.convert(out_text, "zh-cn")


def hex_decoder(out_text, out_byte, encoding_from, encoding_to):

    return codecs.decode(codecs.decode(out_text, "hex_codec"), encoding_from, "replace")


def hexx_decoder(out_text, out_byte, encoding_from, encoding_to):

    return codecs.decode(codecs.decode(out_text.replace("\\x", ""), "hex_codec"), encoding_from, "replace")


def html_decode(out_text, out_byte, encoding_from, encoding_to):

    return html.unescape(out_text)


def js_ascii_oct_decode(out_text, out_byte, encoding_from, encoding_to):

    return "".join([chr(int(x, 8)) for x in out_text.split("\\") if x])


def js_ascii_hex_decode(out_text, out_byte, encoding_from, encoding_to):

    return "".join([chr(int(x, 16)) for x in out_text.split("\\x") if x])


def unicode_s_decode(out_text, out_byte, encoding_from, encoding_to):

    return "".join([chr(int(x, 16)) for x in out_text.split("\\u") if x])


def unicode_u_decode(out_text, out_byte, encoding_from, encoding_to):

    return "".join([chr(int(x, 16)) for x in out_text.split("%u") if x])


def international_decode(out_text, out_byte, encoding_from, encoding_to):

    res = []
    for x in out_text.split(","):
        ba = bytearray([int(x[y * 2: y * 2 + 2], 16) + 0x80 for y in range(len(x) // 2)])
        res.append(codecs.decode(ba, encoding_from, "replace"))

    return "".join(res)


def utf7_decode(out_text, out_byte, encoding_from, encoding_to):

    return codecs.decode(out_byte, "utf7")


def machine_decode(out_text, out_byte, encoding_from, encoding_to):

    return "".join([bytes.fromhex(format(int(x), "x")).decode(encoding_from) for x in out_text.split(",") if x])

