package com.zerotwoone.talkingabc.find;

import android.os.Bundle;
import android.widget.FrameLayout;

import com.zerotwoone.talkingabc.BaseGameActivity;
import com.zerotwoone.talkingabc.BaseSoundClass;
import en.com.zerotwoone.abclearning.R;

public class FindActivity extends BaseGameActivity {

	private FrameLayout mMainFrame;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		mMainFrame = new FrameLayout(this);
		setContentView(mMainFrame);
		
		if (mSounds == null) {
			mSounds = new BaseSoundClass(this, true, 1) {
				
				@Override
				protected void loadsound() {
					load(R.raw.find_the_letter);
					load(R.raw.splash);
				}
			};
		}
		
		getFragmentManager().beginTransaction()	.replace(android.R.id.content, 
				new FindViewFragment(),	FindViewFragment.TAG).commit();
	}
}
