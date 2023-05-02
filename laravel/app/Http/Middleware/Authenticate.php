<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Symfony\Component\HttpFoundation\Response;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        if (!$request->expectsJson()) {
            abort(response()->json([
                'status' => 'error',
                'message' => 'Token 驗證失敗。請重新登入。',
            ], Response::HTTP_UNAUTHORIZED));
        }
    }
 
   
}
