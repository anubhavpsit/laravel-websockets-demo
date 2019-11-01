<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Message;
use Illuminate\Http\Request;

class GroupChatsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return view('groupchat');
    }

    public function fetchMessages()
    {
        return Message::with('user')->get();
    }

    public function sendMessage(Request $request)
    {
        \Log::info("Came in sendMessage");
        $message = auth()->user()->messages()->create([
            'message' => $request->message
        ]);

		broadcast(new MessageSent(auth()->user(), $message))->toOthers();

        return ['status' => 'Message Sent!', 'data' => ['user' => auth()->user(), 'message' => $message]];
    }

    public function sendFile(Request $request)
    {
        \Log::info("Came in sendFile");
        $fileType = $request->file('files')->getMimeType();
        $displayName = $request->file('files')->getClientOriginalName();
        $message = auth()->user()->messages()->create([
            'message' => $displayName,
            'message_type' => $request->message_type,
            'aaaa' => 'ad'
        ]);

        $messageId = $message->id;

        $userData = json_decode($request->user);
        $userId = $userData->id;
        $imageName = $userId."_".$messageId."_chat".time().".".$request->file('files')->getClientOriginalExtension();
        $imagePath = "public/chats/";
        \Storage::putFileAs($imagePath, $request->file('files'), $imageName);
        $fileMessage = new Message();
        $fileMessage->updatedFileInfo($messageId, ['file_path' => $imageName, 'file_type' => $fileType]);

        $messageData = Message::find(['id' => $messageId])->first();
        \Log::info(json_encode($messageData));
        broadcast(new MessageSent(auth()->user(), $messageData))->toOthers();
        return ['status' => 'Message Sent!', 'data' => ['user' => auth()->user(), 'message' => $messageData]];
    }
}
