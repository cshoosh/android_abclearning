package com.zerotwoone.talkingabc.match;

import android.os.Bundle;
import android.widget.FrameLayout;

import com.zerotwoone.talkingabc.BaseGameActivity;
import com.zerotwoone.talkingabc.BaseSoundClass;
import en.com.zerotwoone.abclearning.R;

public class MatchActivity extends BaseGameActivity {
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		setContentView(new FrameLayout(this));
		
		if (mSounds == null) {
			mSounds = new BaseSoundClass(this, true, 2) {
				@Override
				protected void loadsound() {
					load(R.raw.glitter);
					load(R.raw.whoosh);
					load(R.raw.match_the_animal);
					load(R.raw.squeak_sound);
				}
			};
		}	
		
		getFragmentManager().beginTransaction().replace(android.R.id.content, new MatchFragment()
				, MatchFragment.TAG).commit();
	}
	
}
