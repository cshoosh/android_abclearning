package com.zerotwoone.talkingabc.animation;

import android.graphics.Canvas;

public class CircleAnimation extends BaseAnimationDrawable {

	private float mStroke;

	public CircleAnimation(int bgcolor, float stroke) {
		super(bgcolor);		
		
		mStroke = stroke;
		mPaintColor.setStrokeWidth(stroke);
	}

	@Override
	public void afterAnim(Canvas canvas) {
		if (mOffset >= mStroke * 2) mOffset = 0;
	}

	@Override
	public void beforeAnim(Canvas canvas) {
		for (int i = 0; i < mLongSide / mStroke; i += 2)
			canvas.drawCircle(getBounds().exactCenterX(), getBounds()
					.exactCenterY(), mStroke * i + mOffset, mPaintColor);
		
	}

	@Override
	public AnimationList getAnimation() {
		return AnimationList.Circle;
	}
}
