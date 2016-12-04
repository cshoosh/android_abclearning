package com.zerotwoone.talkingabc.find;

import android.graphics.Bitmap;

public interface FindCallback {
	public abstract void onCreateFindView(FindView view);

	public abstract String getLetter();

	public abstract void onRightFindViewClick();
	
	public abstract void onWrongFindViewClick();
	
	public abstract boolean isStarted();
	
	public abstract Bitmap getSplash();
	
}