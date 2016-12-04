package com.zerotwoone.talkingabc;

import com.zerotwoone.talkingabc.dialog.SettingsDialog;
import en.com.zerotwoone.abclearning.R;

import android.media.MediaPlayer;
import android.preference.PreferenceManager;

public abstract class BaseGameActivity extends FullScreenActivity {
	
	protected BaseSoundClass mSounds;
	private MediaPlayer mPlayer;
		
	@Override
	protected void onStart() {
		super.onStart();
		mPlayer = MediaPlayer.create(this, R.raw.ingame_half);
		mPlayer.setVolume(0.6f, 0.6f);
		mPlayer.setLooping(true);
	}
		
	@Override
	protected void onResume() {
		super.onResume();
		
		if (PreferenceManager.getDefaultSharedPreferences(getApplicationContext())
				.getBoolean(SettingsDialog.MUSIC_CHECK_TAG, true))
			mPlayer.start();
		
		mSounds.mSoundPool.autoResume();
	}
	
	@Override
	protected void onPause() {
		super.onPause();
		
		if (PreferenceManager.getDefaultSharedPreferences(getApplicationContext())
				.getBoolean(SettingsDialog.MUSIC_CHECK_TAG, true))
			mPlayer.pause();
		
		mSounds.mSoundPool.autoPause();
	}
	
	@Override
	protected void onStop() {
		super.onStop();
		mPlayer.release();
		mPlayer = null;
	}
		
	public BaseSoundClass getSound() {
		return mSounds;
	}
}
