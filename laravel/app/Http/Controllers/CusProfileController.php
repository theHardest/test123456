<?php

namespace App\Http\Controllers;

use App\Models\CusProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Traits\ApiResponseTrait;


class CusProfileController extends Controller
{
    use ApiResponseTrait;
    public function index()
    {
        // 預先載入 CusProfile 與 Label 的資料
        $cusProfiles = CusProfile::with('labelValues')->get();

        // dd($cusProfiles);

        // 將每一筆資料轉換成需要的格式，並且建立一個新的陣列
        $data = $cusProfiles->map(function ($profile) {
            return [
                'id' => $profile->id,
                'cus_name' => $profile->cus_name,
                'cus_number' => $profile->cus_number,
                'cus_email' => $profile->cus_email,
                'cus_idnumber' => $profile->cus_idnumber,
                'cus_remark' => $profile->cus_remark,
                'cus_status' => $profile->cus_status,
                'cus_level' => $profile->cus_level,
                'label_names' => $profile->labelValues->map(function ($label) {
                    return [
                        'id' => $label->id,
                        'label_name' => $label->label_name,
                    ];
                })->toArray(),
            ];
        });

        return $this->webSuccess($data);
    }
    public function index2(Request $request)
    {

        $page = $request->input('page', 1);
        $size = $request->input('size');
        $total = CusProfile::count();
        $limit = $size ? $size : $total;
        $offset = ($page - 1) * $size;
        $cusProfiles = CusProfile::with('labelValues')
            ->offset($offset)
            ->limit($limit)
            ->get();

        $data = $cusProfiles->map(function ($profile) {
            return [
                'id' => $profile->id,
                'cus_name' => $profile->cus_name,
                'cus_number' => $profile->cus_number,
                'cus_email' => $profile->cus_email,
                'cus_idnumber' => $profile->cus_idnumber,
                'cus_remark' => $profile->cus_remark,
                'cus_status' => $profile->cus_status,
                'cus_level' => $profile->cus_level,
                'label_names' => $profile->labelValues->map(function ($label) {
                    return [
                        'id' => $label->id,
                        'label_name' => $label->label_name,
                    ];
                })->toArray(),
            ];
        });
        return response()->json(['status' => 'success', 'data' => $data, 'total' => $total]);
    }

    public function create(Request $request)
    {
        // $user = Auth::user();
        $userId = auth()->user()->id;
        $validatedData = $request->validate([
            'cus_name' => 'required',
            'cus_number' => 'required',
            'cus_email' => 'required|email',
            'cus_idnumber' => 'required',
            'cus_remark' => 'nullable',
            'cus_status' => 'nullable',
            'cus_level' => 'nullable',
        ]);

        // $cusProfile->create_user_id = Auth::id();
        try {
            //方法一
            // $cusProfile = new CusProfile;
            // $cusProfile->create_user_id = $validatedData['user_id'];
            // $cusProfile->edit_user_id = 0;
            // $cusProfile->cus_name = $validatedData['cus_name'];
            // $cusProfile->cus_number = $validatedData['cus_number'];
            // $cusProfile->cus_email = $validatedData['cus_email'];
            // $cusProfile->cus_idNumber = $validatedData['cus_idnumber'];
            // $cusProfile->cus_remark = $validatedData['cus_remark'];
            // $cusProfile->cus_status = $validatedData['cus_status'];
            // $cusProfile->cus_level = $validatedData['cus_level'];
            // $cusProfile->save();

            //方法二
            CusProfile::create([
                'create_user_id' => $userId,
                'edit_user_id' => 0,
                'cus_name' => $validatedData['cus_name'],
                'cus_number' => $validatedData['cus_number'],
                'cus_email' => $validatedData['cus_email'],
                'cus_idNumber' => $validatedData['cus_idnumber'],
                'cus_remark' => $validatedData['cus_remark'],
                'cus_status' => $validatedData['cus_status'],
                'cus_level' => $validatedData['cus_level'],
            ]);
            return $this->message('新增成功');
            // return response()->json(['status' => "success", 'message' => '新增成功']);
        } catch (\Exception $e) {
            dd($e);
        }
    }
    public function edit(Request $request, CusProfile $cusProfile)
    {
        $data = $request->all(); // 從請求中取得所有資料
        $label_ids = collect($data['label_names'])->pluck('id')->toArray(); // 從請求中取得標籤 ID 陣列
        $user_id = auth()->user()->id; // 取得當前使用者的 ID
        $id = $request->id; // 從請求中取得客戶的 ID

        try {
            DB::beginTransaction(); // 開始資料庫事務
            //改成由路由直接獲取
            // $cusProfile = CusProfile::findOrFail($id); // 根據客戶的 ID 取得客戶資料
            // 更新客戶資料
            $columns = array_diff_key($data, array_flip(['label_names', 'cus_id', 'user_id', 'id'])); // 從請求中移除不需要更新的欄位

            $columns['edit_user_id'] = $user_id; // 設定編輯使用者的 ID
            $columns['update_time'] = Carbon::now(); // 設定更新時間
            $cusProfile->update($columns); // 更新客戶資料

            // 取得客戶的標籤
            $labels = $cusProfile->labels()->pluck('label_id')->toArray(); // 取得客戶標籤的 ID
            // 新增標籤
            $labelIdsToAdd = array_diff($label_ids, $labels); // 找出需要新增的標籤
            $cusProfile->labels()->createMany(array_map(function ($label_id) {
                return [
                    'label_id' => $label_id,
                ];
            }, $labelIdsToAdd)); // 逐一新增標籤

            // 刪除標籤
            $labelIdsToDelete = array_diff($labels, $label_ids); // 找出需要刪除的標籤
            $cusProfile->labels()->whereIn('label_id', $labelIdsToDelete)->delete(); // 刪除標籤

            DB::commit(); // 提交資料庫事務
            return $this->message('成功修改');
        } catch (\Exception $e) { // 如果發生錯誤，回滾資料庫事務
            DB::rollBack();
            return $this->webError($e->getMessage());
        }
    }

    public function edit2(Request $request)
    {
        $data = $request->all(); // 從請求中取得所有資料
        $label_names = $data['label_names']; // 從請求中取得標籤名稱
        $userId = auth()->user()->id; // 取得當前使用者的 ID
        $id = $request->id; // 從請求中取得客戶的 ID

        try {
            DB::beginTransaction(); // 開始資料庫事務
            $cusProfile = CusProfile::findOrFail($id); // 根據客戶的 ID 取得客戶資料
            // 更新客戶資料
            $columns = array_diff_key($data, array_flip(['label_names', 'cus_id', 'user_id', 'id'])); // 從請求中移除不需要更新的欄位
            $columns['edit_user_id'] = $userId; // 設定編輯使用者的 ID
            $columns['update_time'] = Carbon::now(); // 設定更新時間
            $cusProfile->update($columns); // 更新客戶資料

            // 取得客戶的標籤
            $labels = $cusProfile->labels->pluck('label_id')->toArray(); // 取得客戶標籤的 ID
            // 新增標籤
            $labelIdsToAdd = array_filter($label_names, function ($label) use ($labels) {
                return !in_array($label['id'], $labels);
            }); // 找出需要新增的標籤
            foreach ($labelIdsToAdd as $label) { // 逐一新增標籤
                $cusProfile->labels()->create([
                    'cus_id' => $id,
                    'label_id' => $label['id']
                ]);
            }
            // 刪除標籤
            $labelIdsToDelete = array_filter($labels, function ($label) use ($label_names) {
                return !in_array($label, array_column($label_names, 'id'));
            }); // 找出需要刪除的標籤
            $cusProfile->labels()->where('cus_id', $id)->whereIn('label_id', $labelIdsToDelete)->delete(); // 刪除標籤

            DB::commit(); // 提交資料庫事務

            return response()->json(['status' => "success", 'message' => '成功修改'], 200); // 回傳修改成功的訊息
        } catch (\Exception $e) { // 如果發生錯誤，回滾資料庫事務
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500); // 回傳錯誤訊息
        }
    }
    public function destroy(CusProfile $cusProfile)
    {
        if (!$cusProfile) {
            return response()->json(['status' => "error", 'message' => '刪除失敗，指定的用戶不存在'], 404);
        }
        // 刪除 CusProfile 資料及其相關的 CusProfileLabel 資料
        $cusProfile->delete();
        $cusProfile->labels()->delete();
        return response()->json(['status' => "success", 'message' => '成功刪除']);
    }
}
