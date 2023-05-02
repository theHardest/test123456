<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CusProfileController;
use App\Http\Controllers\LabelController;
use App\Services\TestService;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::prefix('user')->controller(UserController::class)->group(function () {
    Route::get('userinfo', 'getUserInfo');
    Route::post('register', 'register');
    Route::post('login', 'login');
    Route::post('lineLogin', 'lineLogin');
});
Route::prefix('cus')->middleware('auth:api')->controller(CusProfileController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/index', 'index2');
    Route::post('/', 'create');
    Route::delete('/{cusProfile}', 'destroy');
    Route::patch('/{cusProfile}', 'edit');
});

Route::prefix('label')->middleware('auth:api')->controller(LabelController::class)->group(function () {
    Route::get('/', 'index');
    Route::post('/', 'create');
});
Route::get('test', App\Http\Controllers\CusProfileLabelController::class);
