package com.zerotwoone.talkingabc.match;

import java.util.ArrayList;
import java.util.Random;

import android.app.Fragment;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.zerotwoone.talkingabc.BaseGameActivity;
import com.zerotwoone.talkingabc.BaseSoundClass;
import en.com.zerotwoone.abclearning.R;
import com.zerotwoone.talkingabc.Static;
import com.zerotwoone.talkingabc.animation.AnimationList;
import com.zerotwoone.talkingabc.animation.BaseAnimationDrawable;

public class MatchFragment extends Fragment implements MatchCallback {

	public static final String TAG = "matchFragmentTag";

	private ArrayList<MatchView> mMatchViews = new ArrayList<MatchView>();
	private boolean isLocked = true;
	private BaseSoundClass mSoundInstance;

	private MatchView[] mMatchingArray = new MatchView[2];

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		View ret = inflater.inflate(R.layout.match_view, container, false);

		mSoundInstance = ((BaseGameActivity)getActivity()).getSound();
		generateViews();		
		
		ret.post(new Runnable() {
			
			@Override
			public void run() {
				mSoundInstance.play(R.raw.match_the_animal);
			}
		});
		
		ret.postDelayed(new Runnable() {
			@Override
			public void run() {
				for (MatchView view : mMatchViews)
					view.hide();
			}
		}, 1500);
		return ret;
	}

	private void generateViews() {
		ArrayList<String> mLetter = new ArrayList<String>();
		Random random = new Random();
		String mRandomLetter;

		for (int i = 0; i < mMatchViews.size(); i++) {
			if (mMatchViews.get(i).isAssisgned())
				continue;

			BaseAnimationDrawable drawable = AnimationList
					.getRandomAnimation(Static.getRandomColor(getActivity()));
			drawable.setStill(true);
			do {
				mRandomLetter = Static.parsetoletter(random.nextInt(26));
			} while (mLetter.contains(mRandomLetter));

			mLetter.add(mRandomLetter);

			Drawable mBmp = Static.getMatchBitmap(getActivity(), mRandomLetter);
			mMatchViews.get(i).setAssignedLetter(mRandomLetter, drawable, mBmp);

			while (!mMatchViews.get(random.nextInt(mMatchViews.size()))
					.setAssignedLetter(mRandomLetter, drawable, mBmp));
		}
	}

	private void matchSolveCall() {
		mMatchingArray[0].setSolved(true);
		mMatchingArray[1].setSolved(true);
		isLocked = false;
		mMatchingArray[0] = null;
		mMatchingArray[1] = null;

		playSound(R.raw.glitter);

		for (MatchView view : mMatchViews)
			if (!view.isSolved())
				return;

		try {
			mSoundInstance.playExclaim();
			getView().postDelayed(new Runnable() {

				@Override
				public void run() {
					try {
						getFragmentManager().beginTransaction().replace(android.R.id.content,
									new MatchFragment(), TAG).commit();
					} catch (NullPointerException ex) {ex.printStackTrace();}
				}
			}, 2500);
		} catch (NullPointerException ex) {ex.printStackTrace();}
	}

	@Override
	public void setMatchView(MatchView view) {
		mMatchViews.add(view);
	}

	@Override
	public void onShowBegin(MatchView view) {
		if (mMatchingArray[0] == null)
			mMatchingArray[0] = view;
		else if (mMatchingArray[0] != view) {
			mMatchingArray[1] = view;
			isLocked = true;
		}
	}

	@Override
	public void onShowEnd(MatchView view) {
		if (view == mMatchingArray[1]) {
			if (mMatchingArray[0].getLetter() == mMatchingArray[1].getLetter()) {
				matchSolveCall();
			} else {
				mMatchingArray[0].hide();
				mMatchingArray[1].hide();
				mSoundInstance.play(R.raw.squeak_sound);
			}
		}
	}

	@Override
	public void onHideBegin(MatchView view) {
		if (mMatchingArray[0] == view)
			mMatchingArray[0] = null;

		if (mMatchingArray[1] == view)
			mMatchingArray[1] = null;
	}

	@Override
	public void onHideEnd(MatchView view) {
		isLocked = false;
	}

	@Override
	public boolean isLocked() {
		return isLocked;
	}

	@Override
	public void playSound(int id) {
		if (mSoundInstance != null)
			mSoundInstance.play(id);
	}
}
