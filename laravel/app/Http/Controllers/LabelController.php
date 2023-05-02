<?php

namespace App\Http\Controllers;

use App\Models\Label;
use Illuminate\Http\Request;

class LabelController extends Controller
{
    public function index()
    {
        $label = Label::get();
        return response()->json([
            'status' => 'success',
            'data' => $label,
        ]);
    }
    public function create(Request $request)
    {
        // 驗證請求參數
        if (empty($request->label_name)) {
            return response()->json(['status' => 'error', 'message' => '標籤不能為空']);
        }
        // 檢查是否已經存在於資料庫中
        $existingLabel = Label::where('label_name', $request->label_name)->first();
        if ($existingLabel !== null) {
            return response()->json(['status' => 'error', 'message' => '標籤重複']);
        }
        // 新增資料
        $label = Label::create([
            'label_name' => $request->label_name
        ]);
        // 返回新增的資料
        return response()->json(['status' => 'success', 'data' => $label]);
    }
}
