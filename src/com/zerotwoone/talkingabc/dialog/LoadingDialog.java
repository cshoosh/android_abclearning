package com.zerotwoone.talkingabc.dialog;

import android.app.DialogFragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.RotateAnimation;

import en.com.zerotwoone.abclearning.R;

public class LoadingDialog extends DialogFragment {
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		setCancelable(false);
	}
	
	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		return inflater.inflate(R.layout.loading, container, false);				
	}	
	
	@Override
	public void onResume() {
		super.onResume();
		
		RotateAnimation anim = new RotateAnimation(0, 360, Animation.RELATIVE_TO_SELF, 0.5f,
				Animation.RELATIVE_TO_SELF, 0.5f);
		anim.setDuration(2800);
		anim.setRepeatCount(Animation.INFINITE);
		anim.setRepeatMode(Animation.RESTART);
		
		if (getView() != null)
			getView().findViewById(R.id.imgLoading).startAnimation(anim);
	}
	
	@Override
	public void onPause() {
		super.onPause();
		
		if (getView() != null)
			getView().findViewById(R.id.imgLoading).getAnimation().cancel();
	}
}
