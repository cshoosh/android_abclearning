package com.zerotwoone.talkingabc.match;

import android.app.Activity;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.view.View;
import android.view.View.OnClickListener;

import en.com.zerotwoone.abclearning.R;
import com.zerotwoone.talkingabc.Static;
import com.zerotwoone.talkingabc.animation.BaseAnimationDrawable;

public class MatchView extends View implements Runnable, OnClickListener {

	private MatchCallback mCallback;
	private BaseAnimationDrawable mDrawable;
	private String mLetter;

	private boolean isAssigned, isSolved;
	private boolean isAnimating, isHiding;
	
	private int mOffset;
	
	private static final Paint mBorderPaint;
	private Drawable mAnimalBitmap;
	
	static {
		mBorderPaint = new Paint();
		mBorderPaint.setColor(Color.BLACK);
		mBorderPaint.setStyle(Style.STROKE);
		mBorderPaint.setStrokeWidth(2);
	}

	public MatchView(Context context, AttributeSet attrs) {
		super(context, attrs);
		init(context);
	}

	public MatchView(Context context) {
		super(context);
		init(context);
	}

	private void init(Context cntxt) {

		mCallback = (MatchCallback) ((Activity) cntxt).getFragmentManager()
				.findFragmentByTag(MatchFragment.TAG);
		mCallback.setMatchView(this);
		
		setSoundEffectsEnabled(false);
		setOnClickListener(this);
	}
	
	public void hide() {
		if (!isSolved) {
			mCallback.onHideBegin(this);
			isAnimating = true;
			isHiding = true;
			invalidate();
		}
	}
	
	public void show() {
		if (!mCallback.isLocked()) {
			mCallback.onShowBegin(this);
			isAnimating = true;
			isHiding = false;
			invalidate();
		}		
	}

	public boolean isSolved(){
		return isSolved;
	}
	
	public void setSolved(boolean isSolved){
		this.isSolved = isSolved;
	}
	
	public boolean setAssignedLetter(String letter,
			BaseAnimationDrawable drawable, Drawable bmp) {
		if (isAssigned)
			return false;
		
		isAssigned = true;
		mLetter = letter;
		mDrawable = drawable;
		mAnimalBitmap = bmp;		
		
		post(this);
		return true;
	}

	public boolean isAssisgned() {
		return isAssigned;
	}
	
	public String getLetter() {
		return mLetter;
	}
	
	@Override
	protected void onDraw(Canvas canvas) {
		
		if (mDrawable != null)
			mDrawable.draw(canvas);

		super.onDraw(canvas);
		
		if (mAnimalBitmap != null)
			mAnimalBitmap.draw(canvas);
		
		if (isAnimating) {
			canvas.save();
			canvas.translate(0, mOffset);
			if (!isHiding) {
				mOffset += 10;
				if (mOffset >= getHeight()) {
					mOffset = getHeight();
					isAnimating = false;
					mCallback.onShowEnd(this);
				}					
			} else {
				mOffset -= 10;
				if (mOffset <= 0) {
					mOffset = 0;
					isAnimating = false;
					mCallback.onHideEnd(this);
					
				}
			}
			canvas.drawBitmap(Static.COVER, null, mDrawable.getBounds(), null);
			canvas.restore();
			invalidate();
		}
		
		if (isHiding && !isAnimating)
			canvas.drawBitmap(Static.COVER, null, mDrawable.getBounds(), null);
		
		canvas.drawRect(0, 0, getWidth(), getHeight(), mBorderPaint);
		
	}

	@Override
	public void run() {
		if (mDrawable != null)
			mDrawable.setBounds(0, 0, getWidth(), getHeight());
		
		if (mAnimalBitmap != null)
			mAnimalBitmap.setBounds(0, 0, getWidth(), getHeight());
		mOffset = getHeight();
		
		invalidate();
	}

	@Override
	public void onClick(View v) {
		if (!(isSolved() || mCallback.isLocked())) {
			if (isHiding)
				show();
			else
				hide();
			
			mCallback.playSound(R.raw.whoosh);
		}
	}

}
