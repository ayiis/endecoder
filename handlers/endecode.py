import q
import time
import codecs
from urllib.parse import unquote, quote

from ._raw_endecoder import (

    default_encoder, default_decoder,
    base64_encoder, base64_decoder,
    url_char_encoder, url_encoder, url_decoder,
    chinese_s2t, chinese_t2s,
    hex_encoder, hex_decoder,
    hexx_encoder, hexx_decoder,
    html_encode, html_hex_encode, html_dec_encode, html_decode,
    js_ascii_oct_encode, js_ascii_oct_decode,
    js_ascii_hex_encode, js_ascii_hex_decode,
    unicode_s_encode, unicode_s_decode,
    unicode_u_encode, unicode_u_decode,
    international_encode, international_decode,
    utf7_encode, utf7_decode,
    machine_encode, machine_decode,
    war3_s2ih, war3_ih2s,

    # 不可逆
    md5_encoder_16, md5_encoder_32,
    sha_encoder_1, sha_encoder_256, sha_encoder_512
)


r"""
    ✅ 字符编码转换
    ✅ URL 特殊字符编码
    ✅ URL 完全编码
    ✅ HTML 实体编码
    ✅ HTML 十进制编码
    ✅ HTML 十六进制编码
    ✅ BASE64
    ✅ ASCII 八进制
    ✅ ASCII 十六进制 == ShellCode
    ✅ Unicode编码 %u
    ✅ Unicode编码 \u
    ✅ HEX 转换
    ✅ HEX 转换 \x
    ✅ MD5 16位
    ✅ MD5 32位
    ✅ 机器内码
    ✅ ASP UTF7编码
    ✅ ETERM 国际码
    ✅ GBX 中文简繁转换
    ✅ war3 字符串ID
"""

LMB_NONE = lambda *_: ""

ENCODERS = {
    "字符编码转换": default_encoder,
    "MD5 16位": md5_encoder_16,
    "MD5 32位": md5_encoder_32,
    "SHA1": sha_encoder_1,
    "SHA256": sha_encoder_256,
    "SHA512": sha_encoder_512,
    "BASE64": base64_encoder,
    "URL 特殊字符编码": url_char_encoder,
    "URL 完全编码": url_encoder,
    "GBX 中文简繁转换": chinese_s2t,
    "HEX 转换": hex_encoder,
    r"HEX 转换 \x": hexx_encoder,
    "HTML 实体编码": html_encode,
    "HTML 十进制编码": html_dec_encode,
    "HTML 十六进制编码": html_hex_encode,
    "ASCII 八进制": js_ascii_oct_encode,
    "ASCII 十六进制": js_ascii_hex_encode,
    "ShellCode": js_ascii_hex_encode,
    r"Unicode编码 \u": unicode_s_encode,
    "Unicode编码 %u": unicode_u_encode,
    "ETERM 国际码": international_encode,
    "ASP UTF7编码": utf7_encode,
    "机器内码": machine_encode,
    "war3 字符串转ID": war3_s2ih,
}

DECODERS = {
    "字符编码转换": default_decoder,
    "MD5 16位": LMB_NONE,
    "MD5 32位": LMB_NONE,
    "SHA1": LMB_NONE,
    "SHA256": LMB_NONE,
    "SHA512": LMB_NONE,
    "BASE64": base64_decoder,
    "URL 特殊字符编码": url_decoder,
    "URL 完全编码": url_decoder,
    "GBX 中文简繁转换": chinese_t2s,
    "HEX 转换": hex_decoder,
    r"HEX 转换 \x": hexx_decoder,
    "HTML 实体编码": html_decode,
    "HTML 十进制编码": html_decode,
    "HTML 十六进制编码": html_decode,
    "ASCII 八进制": js_ascii_oct_decode,
    "ASCII 十六进制": js_ascii_hex_decode,
    "ShellCode": js_ascii_hex_decode,
    r"Unicode编码 \u": unicode_s_decode,
    "Unicode编码 %u": unicode_u_decode,
    "ETERM 国际码": international_decode,
    "ASP UTF7编码": utf7_decode,
    "机器内码": machine_decode,
    "war3 字符串转ID": war3_ih2s,
}


async def decode(req_data):
    print("req_data: %s" % (req_data), flush=True)

    method = req_data["method"]
    in_text = req_data["ta_in"]
    out_text = req_data["ta_out"]
    encoding_to = req_data["encodingt"]
    encoding_from = req_data["encodingf"]

    out_byte = codecs.encode(out_text, encoding_to, "replace")
    res = DECODERS[method](out_text, out_byte, encoding_from, encoding_to)

    return res


async def encode(req_data):
    print("req_data: %s" % (req_data), flush=True)

    method = req_data["method"]
    in_text = req_data["ta_in"]
    out_text = req_data["ta_out"]
    encoding_to = req_data["encodingt"]
    encoding_from = req_data["encodingf"]

    in_byte = codecs.encode(in_text, encoding_from, "replace")
    res = ENCODERS[method](in_text, in_byte, encoding_to, encoding_from)

    return res
