<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenBlacklistedException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Symfony\Component\HttpFoundation\Response;
use App\Traits\ApiResponseTrait;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;

class Handler extends ExceptionHandler
{
    use ApiResponseTrait;
    public function register()
    {
        $this->reportable(function (Throwable $e) {
           
        });
    }

    public function render($request, Throwable $exception)
    {
        //1.Model找不到資源
        if ($exception instanceof ModelNotFoundException) {
            return $this->errorResponse(
                '找不到資源',
                Response::HTTP_NOT_FOUND
            );
        }
        //2.網址輸入錯誤(新增判斷)
        if ($exception instanceof NotFoundHttpException) {
            return $this->errorResponse(
                '無法找到此網址',
                Response::HTTP_NOT_FOUND
            );
        }
        //3.網址不允許該請求動詞(新增判斷)
        if ($exception instanceof MethodNotAllowedHttpException) {
            return $this->errorResponse(
                $exception->getMessage(),
                Response::HTTP_METHOD_NOT_ALLOWED
            );
        }
        // dd($exception);
        // echo '執行父類render';
        return parent::render($request, $exception);
    }
   
}


