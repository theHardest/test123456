<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CusProfileLabel extends Model
{
    use HasFactory;
    protected $table = 'cus_profile_label';
    protected $fillable = ['cus_id', 'label_id'];
    public $timestamps = false;

    public function cus()
    {
        return $this->belongsTo('App\Models\CusProfile', 'cus_id', 'id');
    }
    public function label()
    {
        return $this->belongsTo('App\Models\Label', 'label_id', 'id');
    }
}