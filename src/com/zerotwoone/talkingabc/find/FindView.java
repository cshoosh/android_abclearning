package com.zerotwoone.talkingabc.find;

import android.animation.ValueAnimator;
import android.animation.ValueAnimator.AnimatorUpdateListener;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Paint.Align;
import android.graphics.Rect;
import android.os.Build;
import android.util.AttributeSet;
import android.view.View;
import android.view.View.OnClickListener;

import com.zerotwoone.talkingabc.Static;
import com.zerotwoone.talkingabc.animation.AnimationList;
import com.zerotwoone.talkingabc.animation.BaseAnimationDrawable;

public class FindView extends View implements OnClickListener {
	private static final Paint PAINT_TEXT;

	static {
		PAINT_TEXT = new Paint();
		PAINT_TEXT.setColor(Static.TRANSPARENT_WHITE);
		PAINT_TEXT.setAlpha(200);
		PAINT_TEXT.setTextAlign(Align.CENTER);
		PAINT_TEXT.setTextSize(110);
	}

	private FindCallback mCallback;
	private String mLetter;
	private boolean isWrong;
	private float mOffset;
	private Rect mBounds;
	private ValueAnimator mAnimator;

	public FindView(Context context, AttributeSet attrs) {
		super(context, attrs);
		init(context);
	}

	public FindView(Context context) {
		super(context);
		init(context);
	}

	@TargetApi(Build.VERSION_CODES.JELLY_BEAN)
	@SuppressWarnings("deprecation")
	private void init(Context context) {
		mCallback = (FindCallback) ((Activity) context).getFragmentManager()
				.findFragmentByTag(FindViewFragment.TAG);
		mCallback.onCreateFindView(this);

		setOnClickListener(this);

		PAINT_TEXT.setTypeface(Static.CUBANO);
		BaseAnimationDrawable bg = AnimationList.getRandomAnimation(Static
				.getRandomColor(context));
		bg.setStill(true);

		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN)
			setBackground(bg);
		else
			setBackgroundDrawable(bg);

		float[] values = { 0, 1 };
		mAnimator = ValueAnimator.ofFloat(values);
		mAnimator.setDuration(250);
		mAnimator.addUpdateListener(new AnimatorUpdateListener() {

			@Override
			public void onAnimationUpdate(ValueAnimator animation) {
				mOffset = (Float) animation.getAnimatedValue();
				invalidate();
			}
		});

		mBounds = new Rect();
	}

	@Override
	public void onClick(View v) {
		if (!isWrong && mCallback.isStarted()) {
			if (mCallback.getLetter() == this.mLetter) {
				mCallback.onRightFindViewClick();
			}

			else {
				mCallback.onWrongFindViewClick();
				isWrong = true;
				mAnimator.start();
			}
			invalidate();
		}		
	}

	@Override
	public void draw(Canvas canvas) {
		super.draw(canvas);
		canvas.drawText(mLetter, getWidth() / 2f, (getHeight() / 2f)
				- ((PAINT_TEXT.ascent() + PAINT_TEXT.descent()) / 2f),
				PAINT_TEXT);

		if (isWrong) {
			mBounds.set(0, 0, getWidth(), getHeight());
			canvas.save();
			canvas.scale(mOffset, mOffset, getWidth() / 2f, getHeight() / 2f);
			if (mCallback.getSplash() != null)
				canvas.drawBitmap(mCallback.getSplash(), null, mBounds, null);
			canvas.restore();
		}
	}

	public String getLetter() {
		return mLetter;
	}

	public void setLetter(String letter) {
		this.mLetter = letter;
	}
}