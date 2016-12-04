package com.zerotwoone.talkingabc.letters;

import android.animation.Animator;
import android.animation.Animator.AnimatorListener;
import android.animation.ValueAnimator;
import android.animation.ValueAnimator.AnimatorUpdateListener;
import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.drawable.AnimationDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.util.AttributeSet;
import android.view.View;
import android.view.animation.DecelerateInterpolator;

@TargetApi(Build.VERSION_CODES.JELLY_BEAN) public class LetterViewParent extends View{
	
	private int mOffset;
	private boolean startAnimation;
	private Drawable mThen, mNow;
	private ValueAnimator mAnimator;
	private String mLetter;
	private LetterCallback mCallback;
	
	public LetterViewParent(Context context, AttributeSet attrs) {
		super(context, attrs);
		init(context);
	}

	public LetterViewParent(Context context) {
		super(context);
		init(context);
	}
	
	private void init (Context context) {
		mCallback = (LetterCallback) context;
	}
	
	public void setBackgroundNow (Drawable drawable, String letter) {
		drawable.setBounds(0, 0, getWidth(), getHeight());
		mLetter = letter;
		
		if (mNow == null) {
			mNow = drawable;
			mThen = drawable;
		} else {
			mThen = mNow;
			mNow = drawable;
		}
		
		setBackground(null);
		
		int[] values = {0, getWidth()};
		mAnimator = ValueAnimator.ofInt(values);
		mAnimator.addUpdateListener(new AnimatorUpdateListener() {
			
			@Override
			public void onAnimationUpdate(ValueAnimator animation) {
				mOffset = (Integer) animation.getAnimatedValue();
				invalidate();
			}
		});

		mAnimator.addListener(new AnimatorListener() {
			
			@Override
			public void onAnimationStart(Animator animation) {
				mOffset = 0;
				startAnimation = true;
				invalidate();
			}
			
			@Override
			public void onAnimationRepeat(Animator animation) {
				
			}
			
			@Override
			public void onAnimationEnd(Animator animation) {
				mOffset = 0;
				startAnimation = false;
				setBackground(mNow);
				((AnimationDrawable) getBackground()).start();
				
				mCallback.LetterClick(mLetter);
				invalidate();
			}
			
			@Override
			public void onAnimationCancel(Animator animation) {
				
			}
		});
		
		mAnimator.setInterpolator(new DecelerateInterpolator());
		mAnimator.setDuration(700);
		mAnimator.start();
	}

	public boolean isAnimating() {
		return startAnimation;
	}
	
	@Override
	protected void onDraw(Canvas canvas) {
		if (startAnimation) {
			if (mThen == null) {
				super.onDraw(canvas);
			} else {
				canvas.save();
				canvas.translate(mOffset - getWidth(), 0);
				mNow.draw(canvas);
				canvas.restore();
				
				canvas.save();
				canvas.translate(mOffset, 0);
				mThen.draw(canvas);
				canvas.restore();
				
			}
			return;
		}
		super.onDraw(canvas);
	}
	
}
