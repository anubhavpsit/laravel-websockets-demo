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
}
