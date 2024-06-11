<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Address;

class WalletController extends Controller
{
    public function wallet(Request $request): JsonResponse
    {
        $address = new Address;
        $address->userId = $request->user()->id; // Assuming you have authentication set up
        $address->address = $request->address;
        $address->save();
        
        return response()->json('ok');
    }
}
