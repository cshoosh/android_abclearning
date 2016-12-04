package com.zerotwoone.talkingabc.animation;

import android.graphics.Canvas;

public class CheckAnimation extends BaseAnimationDrawable {
	private float mSize;
	public CheckAnimation(int bgcolor, float size) {
		super(bgcolor);
		
		mSize = size;
		mPaintColor.setStrokeWidth(10f);
	}
	
	@Override
	public void afterAnim (Canvas canvas) {
		if (mOffset >= mSize)
			mOffset = 0;
	}

	@Override
	public void beforeAnim (Canvas canvas) {
		float side = (mLongSide + mSize) / mSize;
		for (int i = 0; i < side; i++) {
				canvas.drawLine(i * mSize, 0, i * mSize, getBounds().height() + mSize, mPaintColor);
				canvas.drawLine(0, i * mSize - mOffset, getBounds().width(), i * mSize
						- mOffset, mPaintColor);
		}		
	}

	@Override
	public AnimationList getAnimation() {
		return AnimationList.Check;
	}

}


