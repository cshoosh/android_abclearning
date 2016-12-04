package com.zerotwoone.talkingabc.animation;

import android.animation.ValueAnimator;
import android.graphics.Canvas;
import android.graphics.ColorFilter;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.RadialGradient;
import android.graphics.Rect;
import android.graphics.Shader.TileMode;
import android.graphics.drawable.Drawable;

import com.zerotwoone.talkingabc.Static;

public abstract class BaseAnimationDrawable extends Drawable {

	public static final String KEY_DRAWABLE_ANIM = "bgDrawable";
	public static final String KEY_DRAWABLE_COLOR = "bgColor"; 
	
	protected int mOffset;
	protected ValueAnimator mAnimator;
	
	protected Paint mBgGradient, mPaintColor;
	private RadialGradient mGradient;

	private int mCenterColor, mEndColor;
	protected int mLongSide;
	private boolean isStill;

	public BaseAnimationDrawable(int bgcolor) {
		mBgGradient = new Paint();
		mPaintColor = new Paint();

		mBgGradient.setColor(bgcolor);

		mPaintColor.setColor(Static.TRANSPARENT_WHITE);

		mCenterColor = bgcolor;// Static.lighten(bgcolor, 0.5f);
		mEndColor = Static.darken(bgcolor, 0.5f);

		mBgGradient.setStyle(Style.FILL);
		mPaintColor.setStyle(Style.STROKE);
		mPaintColor.setAntiAlias(true);
		
		mAnimator = new ValueAnimator();
	}

	@Override
	protected void onBoundsChange(Rect bounds) {
		super.onBoundsChange(bounds);
		mLongSide = bounds.width() >= bounds.height() ? bounds.width() : bounds
				.height();
		mGradient = new RadialGradient(bounds.exactCenterX(), bounds.centerY(),
				mLongSide, mCenterColor, mEndColor, TileMode.MIRROR);
		mBgGradient.setShader(mGradient);
	}

	@Override
	public void draw(Canvas canvas) {
		canvas.drawPaint(mBgGradient);
		beforeAnim(canvas);

		if (!isStill) {
			mOffset++;
			afterAnim(canvas);
			invalidateSelf();
		}
	}

	@Override
	public void setAlpha(int alpha) {

	}

	@Override
	public void setColorFilter(ColorFilter cf) {

	}

	@Override
	public int getOpacity() {
		return 0;
	}
	
	public int getColor() {
		return mCenterColor;
	}
	
	public void setStill (boolean value) {
		isStill = value;
		if (!isStill)
			invalidateSelf();
	}
	
	public abstract void afterAnim(Canvas canvas);
	public abstract AnimationList getAnimation ();
	public abstract void beforeAnim(Canvas canvas);
}
