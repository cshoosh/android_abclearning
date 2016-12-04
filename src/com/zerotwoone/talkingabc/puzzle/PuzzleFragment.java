package com.zerotwoone.talkingabc.puzzle;

import java.util.ArrayList;
import java.util.Random;

import android.annotation.TargetApi;
import android.app.Fragment;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.zerotwoone.talkingabc.BaseGameActivity;
import com.zerotwoone.talkingabc.BaseSoundClass;
import en.com.zerotwoone.abclearning.R;
import com.zerotwoone.talkingabc.Static;
import com.zerotwoone.talkingabc.animation.AnimationList;
import com.zerotwoone.talkingabc.animation.BaseAnimationDrawable;

public class PuzzleFragment extends Fragment implements PuzzleCallback {
	public static final String TAG = "puzzleview";
	// private static final String KEY_RESOURCEID = "resourceid";

	private int mResourceId;
	private AnimationList mBgDrawable;
	private int mBgColor;
	private BaseSoundClass mSound;

	private ArrayList<PuzzleView> mPuzzleViewArray = new ArrayList<PuzzleView>();

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);


		// if (savedInstanceState == null) {
		mBgColor = 0xFFba7bcf;
		mResourceId = Static.getDrawableResource(new Random().nextInt(26));
		mBgDrawable = AnimationList.getRandom();
		
		Handler mHandler = new Handler();
		Runnable mPost = new Runnable() {
			
			@SuppressWarnings("deprecation")
			@TargetApi(Build.VERSION_CODES.JELLY_BEAN)
			@Override
			public void run() {
				Bitmap animal = BitmapFactory.decodeResource(getResources(), 
						mResourceId);
				
				int width = mPuzzleViewArray.get(0).getHeight() * 3;
				int height = mPuzzleViewArray.get(0).getHeight() * 4;
				
				Bitmap scaled = Bitmap.createScaledBitmap(animal,
						width, height, false);

				BaseAnimationDrawable drawable = AnimationList.getAnimation(
						mBgDrawable, mBgColor);
				drawable.setStill(true);

				if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN)
					getView().setBackground(drawable);
				else
					getView().setBackgroundDrawable(drawable);

				drawable.setBounds(0, 0, getView().getWidth(), getView()
						.getHeight());

				int k = 0;
				for (int i = 0; i < 4; i++) {
					for (int j = 0; j < 3; j++) {
						PuzzleView view = mPuzzleViewArray.get(k);

						Bitmap slice = Bitmap.createBitmap(scaled,
								j * view.getWidth(), i * view.getHeight(),
								view.getWidth(), view.getHeight());

						view.setBaseAnimationDrawable(drawable);
						view.setImageBitmap(slice);
						k++;
					}
				}
			}
		};
		
		mHandler.post(mPost);
		mHandler.postDelayed(new Runnable() {

			@Override
			public void run() {
				playSound(R.raw.solve_the_puzzle);
			}
		}, 100);
		/*
		 * } else { mBgColor =
		 * savedInstanceState.getInt(BaseAnimationDrawable.KEY_DRAWABLE_COLOR);
		 * mResourceId = savedInstanceState.getInt(KEY_RESOURCEID); mBgDrawable
		 * = (AnimationList) savedInstanceState.getSerializable(
		 * BaseAnimationDrawable.KEY_DRAWABLE_ANIM); }
		 */
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		mSound = ((BaseGameActivity)getActivity()).getSound();
		View ret = inflater.inflate(R.layout.puzzle_view, container, false);		
		
		return ret;
	}

	@Override
	public void isSolved() {
		for (PuzzleView view : mPuzzleViewArray) {
			if (view.getPuzzleRotation() == 0)
				continue;
			else
				return;
		}

		mSound.playExclaim();

		for (PuzzleView view : mPuzzleViewArray) 
			view.setSolved(true);

		if (getView().getBackground() != null
				&& getView().getBackground() instanceof BaseAnimationDrawable)
			((BaseAnimationDrawable) getView().getBackground()).setStill(false);
		
		getView().postDelayed(new Runnable() {
			
			@Override
			public void run() {
				getFragmentManager().beginTransaction().replace(android.R.id.content, 
						new PuzzleFragment()).commit();
			}
		}, 2000);
	}

	/*
	 * @Override public void onSaveInstanceState(Bundle outState) {
	 * super.onSaveInstanceState(outState);
	 * 
	 * outState.putInt(KEY_RESOURCEID, mResourceId);
	 * outState.putInt(BaseAnimationDrawable.KEY_DRAWABLE_COLOR, mBgColor);
	 * outState.putSerializable(BaseAnimationDrawable.KEY_DRAWABLE_ANIM,
	 * mBgDrawable); }
	 */

	@Override
	public void setPuzzleView(PuzzleView view) {
		mPuzzleViewArray.add(view);
	}

	@Override
	public void playSound(int id) {
		if (mSound != null)
			mSound.play(id);
	}
}
