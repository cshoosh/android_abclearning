package com.zerotwoone.talkingabc.letters;

import android.annotation.TargetApi;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.Animation.AnimationListener;
import android.widget.TextView;

import com.zerotwoone.talkingabc.BaseGameActivity;
import com.zerotwoone.talkingabc.BaseSoundClass;
import en.com.zerotwoone.abclearning.R;
import com.zerotwoone.talkingabc.Static;
import com.zerotwoone.talkingabc.animation.AnimationList;
import com.zerotwoone.talkingabc.animation.BaseAnimationDrawable;

public class AlphabetActivity extends BaseGameActivity implements
		LetterCallback {

	private LetterViewParent mParent;
	private TextView mNameView;
	private boolean isParentLocked;

	@SuppressWarnings("deprecation")
	@TargetApi(Build.VERSION_CODES.JELLY_BEAN)
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.alphabat_view);
		mNameView = (TextView) findViewById(R.id.txtAnimalName);
		mNameView.setTypeface(Static.CUBANO);
		
		mSounds = new BaseSoundClass(this, false, 1, true) {

				@Override
				protected void loadsound() {
					for (int i = 0; i < 26; i++) {
						String letter = Static.parsetoletter(i);
						load(Static.parseletterToSoundresource(letter));
						load(Static.parseletterToAnimalSoundresource(letter));
					}
				}
			};

		View v = findViewById(R.id.letterViewParentContainer);

		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN)
			v.setBackground(AnimationList.getRandomAnimation(getResources()
					.getColor(R.color.purple)));
		else
			v.setBackgroundDrawable(AnimationList
					.getRandomAnimation(getResources().getColor(R.color.purple)));

		mParent = (LetterViewParent) findViewById(R.id.letterViewParent);

	}

	@Override
	public void LetterClick(final String letter) {

		try {
			mSounds.play(Static.parseletterToSoundresource(letter));

			new Handler().postDelayed(new Runnable() {

				@Override
				public void run() {
					try {
						mSounds.play(Static.parseletterToAnimalSoundresource(letter));
					} catch (NullPointerException e){e.printStackTrace();}
				}
			}, 800);
		} catch (NullPointerException e) {
			e.printStackTrace();
		}
	}

	@TargetApi(Build.VERSION_CODES.JELLY_BEAN)
	@SuppressWarnings("deprecation")
	@Override
	public void LetterChangeParent(final int resource, final String letter,
			final int bgcolor) {
		isParentLocked = true;
		Drawable drawable = getResources().getDrawable(resource);
		BaseAnimationDrawable bg = AnimationList.getRandomAnimation(bgcolor);
		
		Animation hide = new AlphaAnimation(1, 0);
		hide.setDuration(350);
		hide.setFillAfter(true);

		final Animation show = new AlphaAnimation(0, 1);
		show.setDuration(350);
		show.setFillAfter(true);

		
		hide.setAnimationListener(new AnimationListener() {
			@Override public void onAnimationStart(Animation animation) {}
			@Override public void onAnimationRepeat(Animation animation) {}
			
			@Override public void onAnimationEnd(Animation animation) {
				mNameView.setText(Static.getAnimalName(letter));
				mNameView.startAnimation(show);
			}
		});
		
		
		
		mNameView.startAnimation(hide);
		
		if (bg != null) {
			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN)
				findViewById(R.id.letterViewParentContainer).setBackground(bg);
			else
				findViewById(R.id.letterViewParentContainer)
						.setBackgroundDrawable(bg);
		}
		mParent.setBackgroundNow(drawable, letter);
		isParentLocked = false;

	}

	@Override
	public boolean isParentAnimating() {
		if (mParent != null)
			return mParent.isAnimating() || isParentLocked;
		return false;
	}
}
