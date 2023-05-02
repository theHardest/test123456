<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CusProfileLabel;

class CusProfileLabelController extends Controller
{
    //
     public function __invoke()
    {
        $test = CusProfileLabel::find(3);
        // dd($test);
        // echo $test->label;
        // echo $test->cus;
    }
}
