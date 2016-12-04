package com.zerotwoone.talkingabc.find;

import java.util.ArrayList;
import java.util.Random;

import android.app.Fragment;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.zerotwoone.talkingabc.BaseGameActivity;
import com.zerotwoone.talkingabc.BaseSoundClass;
import en.com.zerotwoone.abclearning.R;
import com.zerotwoone.talkingabc.Static;

public class FindViewFragment extends Fragment implements FindCallback {

	public static final String TAG = "FindFragment";

	private ArrayList<FindView> mArray = new ArrayList<FindView>();
	private String whichLetter;
	private boolean isStarted;
	
	private BaseSoundClass mFindSound;
	private Bitmap mSplash;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		mSplash = BitmapFactory.decodeResource(getResources(), R.drawable.splash);
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		final View ret = inflater.inflate(R.layout.find_view, container, false);

		ArrayList<String> indexed = new ArrayList<String>();
		final Random rand = new Random();
		for (FindView fView : mArray) {
			String index;
			do {
				index = Static.parsetoletter(rand.nextInt(26));
			} while (indexed.contains(index));

			indexed.add(index);
			fView.setLetter(index);
		}

		mFindSound = ((BaseGameActivity)getActivity()).getSound();

		if (mFindSound != null) {
			whichLetter = mArray.get(rand.nextInt(mArray.size())).getLetter();
			mFindSound.load(Static.parseletterToSoundresource(whichLetter));
			
			ret.postDelayed(new Runnable() {
				@Override
				public void run() {
					mFindSound.play(R.raw.find_the_letter);
				}
			}, 20);		
			
			ret.postDelayed(new Runnable() {
				@Override
				public void run() {
					mFindSound.play(Static.parseletterToSoundresource(whichLetter));
					
					ret.postDelayed(new Runnable() {
						@Override
						public void run() {
							isStarted = true;							
						}
					}, 500);					
				}
			}, 1400);
		}
		
		return ret;
	}

	@Override
	public void onCreateFindView(FindView view) {
		mArray.add(view);
	}

	@Override
	public String getLetter() {
		return whichLetter;
	}

	@Override
	public void onRightFindViewClick() {
		try {
			mFindSound.playExclaim();
			isStarted = false;
			new Handler().postDelayed(new Runnable() {

				@Override
				public void run() {
					try {
						getFragmentManager().beginTransaction().replace(android.R.id.content,
									new FindViewFragment(), TAG).commit();
					} catch (NullPointerException ex) {ex.printStackTrace();}
				}
			}, 1300);

		} catch (NullPointerException ex) {
			ex.printStackTrace();
		}

	}

	@Override
	public void onWrongFindViewClick() {
		if (mFindSound != null)
			mFindSound.play(R.raw.splash);
	}
	
	@Override
	public void onDestroy() {
		super.onDestroy();
		try {
			mFindSound.unload(Static.parseletterToSoundresource(whichLetter));
		} catch (NullPointerException ex) {ex.printStackTrace();}
	}

	@Override
	public boolean isStarted() {
		return isStarted;
	}

	@Override
	public Bitmap getSplash() {
		return mSplash;
	}
}