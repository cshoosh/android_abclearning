package com.zerotwoone.talkingabc.mainscreen;

import android.annotation.TargetApi;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.OnSharedPreferenceChangeListener;
import android.graphics.drawable.AnimationDrawable;
import android.graphics.drawable.Drawable;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.TextView;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdView;
import com.zerotwoone.talkingabc.FullScreenActivity;
import en.com.zerotwoone.abclearning.R;
import com.zerotwoone.talkingabc.Static;
import com.zerotwoone.talkingabc.animation.AnimationList;
import com.zerotwoone.talkingabc.dialog.ExitConfirmDialog;
import com.zerotwoone.talkingabc.dialog.GamesDialog;
import com.zerotwoone.talkingabc.dialog.SettingsDialog;
import com.zerotwoone.talkingabc.letters.AlphabetActivity;

public class MainScreenActivity extends FullScreenActivity implements OnSharedPreferenceChangeListener {
	
	private static final String DEVICE_ID = "A0CB025723CDC39E7B4B431B82661E2E";
	private MediaPlayer mPool;
	
	@SuppressWarnings("deprecation")
	@TargetApi(Build.VERSION_CODES.JELLY_BEAN) protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		mPool = MediaPlayer.create(this, R.raw.main_screen);
		mPool.setLooping(true);
		
		setContentView(R.layout.main_screen);		
		
		AdView mAdView = (AdView) findViewById(R.id.adView);
        AdRequest adRequest = new AdRequest.Builder().addTestDevice(DEVICE_ID)
        		.addTestDevice(AdRequest.DEVICE_ID_EMULATOR).build();
        
        mAdView.loadAd(adRequest);
        
		((TextView) findViewById(R.id.txtABC)).setTypeface(Static.CUBANO);
		
		TextView alphabet = ((TextView) findViewById(R.id.txtAlphabet));
		TextView games	  = ((TextView) findViewById(R.id.txtGames));
		TextView settings = ((TextView) findViewById(R.id.txtSettings));
		
		alphabet.setTypeface(Static.CUBANO);
		games.setTypeface(Static.CUBANO);
		settings.setTypeface(Static.CUBANO);
		
		alphabet.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				Intent intent = new Intent(MainScreenActivity.this, AlphabetActivity.class);
				startActivity(intent);
			}
		});
		
		games.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				new GamesDialog().show(getFragmentManager(), null);
			}
		});
		
		settings.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				new SettingsDialog().show(getFragmentManager(), null);
			}
		});
				
		findViewById(R.id.imgBear).setBackgroundResource(R.drawable.b_wave);
		((AnimationDrawable)findViewById(R.id.imgBear).getBackground()).start();
		
		findViewById(R.id.imgElephant).setBackgroundResource(R.drawable.e_wave);
		((AnimationDrawable)findViewById(R.id.imgElephant).getBackground()).start();
		
		Drawable dr = AnimationList.getRandomAnimation(getResources().getColor(R.color.sky_blue));
		
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN)
			findViewById(android.R.id.content).setBackground(dr);
		else
			findViewById(android.R.id.content).setBackgroundDrawable(dr);
		
		PreferenceManager.getDefaultSharedPreferences(this)
			.registerOnSharedPreferenceChangeListener(this);
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		
		if (PreferenceManager.getDefaultSharedPreferences(getApplicationContext())
				.getBoolean(SettingsDialog.MUSIC_CHECK_TAG, true))			
			mPool.start();
	}
	
	@Override
	protected void onPause() {
		super.onPause();
		if (PreferenceManager.getDefaultSharedPreferences(getApplicationContext())
				.getBoolean(SettingsDialog.MUSIC_CHECK_TAG, true))
			mPool.pause();
	}
	
	@Override
	protected void onDestroy() {
		super.onDestroy();
		mPool.stop();
		mPool.release();
		
		PreferenceManager.getDefaultSharedPreferences(this)
		.unregisterOnSharedPreferenceChangeListener(this);
	}
	
	@Override
	public void onBackPressed() {
		if (getFragmentManager().findFragmentByTag("Exit") == null)
			new ExitConfirmDialog().show(getFragmentManager(), "Exit");
	}

	@Override
	public void onSharedPreferenceChanged(SharedPreferences sharedPreferences,
			String key) {
		if (key.equals(SettingsDialog.MUSIC_CHECK_TAG)) {
			if (sharedPreferences.getBoolean(key, true))
				mPool.start();
			else
				mPool.pause();
		}
	}
}
