package com.zerotwoone.talkingabc.puzzle;

import android.os.Bundle;
import android.widget.FrameLayout;

import com.zerotwoone.talkingabc.BaseGameActivity;
import com.zerotwoone.talkingabc.BaseSoundClass;
import en.com.zerotwoone.abclearning.R;

public class PuzzleActivity extends BaseGameActivity {
		
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);		
		
		setContentView(new FrameLayout(this));
		
		mSounds = new BaseSoundClass(this, true, 1) {
			
			@Override
			protected void loadsound() {
				load(R.raw.lego_click);
				load(R.raw.solve_the_puzzle);
			}
		};
		
		getFragmentManager().beginTransaction().replace(
				android.R.id.content, new PuzzleFragment() ,PuzzleFragment.TAG).commit();
	}
	
}