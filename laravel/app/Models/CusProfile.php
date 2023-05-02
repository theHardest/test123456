<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CusProfile extends Model
{
    protected $table = 'cus_profile';
    public $timestamps = false;

    protected $fillable = [
        'create_user_id',
        'cus_name',
        'cus_number',
        'cus_email',
        'cus_idNumber',
        'cus_remark',
        'cus_status',
        'cus_level',
        'cus_edit_user_id',
        'edit_user_id',
    ];

    use HasFactory;
    public function labels()
    {
        return $this->hasMany('App\Models\CusProfileLabel', 'cus_id', 'id');
    }
    public function labelValues()
    {
        return $this->hasManyThrough(
            'App\Models\Label',
            'App\Models\CusProfileLabel',
            'cus_id', // foreign key on CusProfileLabel table
            'id', // foreign key on Label table
            'id', // local key on CusProfile table
            'label_id' // local key on CusProfileLabel table
        );
    }
  
}
