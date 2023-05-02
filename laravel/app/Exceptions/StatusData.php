<?php
/**
 * @Name 自定義狀態碼
 * @Description
 * @Auther 卡薩羅馬
 * @Date 2021/11/29 16:49
 */

namespace App\Exceptions;


class StatusData
{
    const API_OK = "success";
    // const API_OK = 200;
    const API_ERR = 201;
    const NOT_LOGGED_IN = 202;
    const TIMEOUT_OR_INVALID = 203;
    const PARAM_ERROR = 204;
    const INFO_EXIST = 205;
    const INFO_NOT_EXIST = 206;
    const UPLOAD_ERROR = 207;
    const BONUS_ERROR = 208;//紅利token失效
    const PAYMENT_FEIBI_ERROR = 500; // 未設置交易密碼

}
