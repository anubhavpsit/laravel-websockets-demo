<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class Message extends Model
{
	protected $table = "messages";
    protected $fillable = ['message', 'message_type', 'file_type', 'file_path'];

    public function user()
    {
    	return $this->belongsTo(User::class);
    }

    public function updatedFileInfo($messageId, $fileData)
    {
        $userImage = DB::table($this->table)->where('id', $messageId)->update(['file_path' => $fileData['file_path'], 'file_type' => $fileData['file_type']]);
        return $userImage;
    }
}
