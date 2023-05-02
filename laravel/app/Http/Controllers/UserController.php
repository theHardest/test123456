<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{



    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'lineLogin']]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'password' => 'required|string|min:6',
            'confirmPassword' => 'required|string|min:6|same:password',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'msg' => '註冊表單資料格式不正確'
            ]);
        }
        $existingUser = User::where('user_name', $request->name)->first();
        if ($existingUser) {
            return response()->json([
                'status' => 'error',
                'message' => '已經註冊過了'
            ]);
        }

        $user = User::create([
            'user_name' => $request->name,
            'user_password' => Hash::make($request->password),
            'user_email' => $request->email,
            'user_avatar' => $request->avatar ?? '',
        ]);
        $token = Auth::login($user);
        return response()->json([
            'status' => 'success',
        ]);
    }
    public function lineLogin(Request $request)
    {
        $existingUser = User::where('user_name', $request->name)->first();
        if ($existingUser) {
            $credentials = [
                'user_name' => $existingUser->user_name,
                'password' => '',
            ];
            $token = Auth::attempt($credentials);
            return response()->json([
                'status' => 'success',
                'data' => [
                    'token' => $token
                ]
            ]);
        }
        $user = User::create([
            'user_name' => $request->name,
            'user_password' => Hash::make(''),
            'user_email' => $request->user_email ?? '',
            'user_avatar' => $request->picture ?? '',
        ]);
        $token = Auth::login($user);
        return response()->json([
            'status' => 'success',
            'data' => [
                'token' => $token
            ]
        ]);
    }

    public function login(Request $request)
    {
        $user = User::where('user_name', $request->input('name'))
            ->first();

        if ($user) {
            if ($user && Hash::check($request->input('password'), $user->user_password)) {
                // 密碼正確，執行登入邏輯
                $credentials = [
                    'user_name' => $user->user_name,
                    'password' => $request->input('password'),
                ];
                $token = Auth::attempt($credentials);
                return response()->json([
                    'status' => 'success',
                    'data' => [
                        'user' => [
                            'id' => $user->id,
                            'user_name' => $user->user_name,
                            'user_password' => $user->user_password,
                            'user_email' => $user->user_email,
                            'user_avatar' => $user->user_avatar,
                        ],
                        'token' => $token,
                    ],
                ]);
            } else {
                // 
                return response()->json([
                    'status' => 'error',
                    'msg' => '密碼錯誤',
                ], 200);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'msg' => '查無此帳號',
            ], 200);
        }
    }

    public function getUserInfo()
    {
        // 會員訊息
        $user = auth()->user();

        // $user = Auth::user();
        $userInfo = [
            'id' => $user->id,
            'user_name' => $user->user_name,
            'user_email' => $user->user_email,
            'user_avatar' => $user->user_avatar
        ];

        return response()->json([
            'status' => 'success',
            'data' => $userInfo
        ]);
    }
}
