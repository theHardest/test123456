<?php
namespace App\Traits;

use App\Exceptions\StatusData;

trait ApiResponseTrait
{
    public function errorResponse($message, $status,$code=null){
        $code = $code ?? $status;

        return response()->json(
            [
                'status'=>"error",
                'message' => $message,
            ],
        );
    }
    public function webSuccess($data = array(), string $message = '', string $status = StatusData::API_OK)
    {
        return response()->json([
            'status' => $status,
            'message' => $message ?: __('exceptions.Ok'),
            'data' => (object)$data
        ]);
    }
    public function message( string $message = '', string $status = StatusData::API_OK)
    {
        return response()->json([
            'status' => $status,
            'message' => $message ?: __('exceptions.Ok'),
        ]);
    }
    public function webError(string $message = '', int $status = StatusData::API_ERR)
    {
        return response()->json([
            'status' => $status,
            'message' => $message ?: __('exceptions.API_ERROR_EXCEPTION'),
            'data' => null
        ]);
    }
}
