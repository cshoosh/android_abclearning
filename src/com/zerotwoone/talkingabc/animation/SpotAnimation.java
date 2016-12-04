package com.zerotwoone.talkingabc.animation;

import android.graphics.Canvas;
import android.graphics.Paint.Style;

public class SpotAnimation extends BaseAnimationDrawable {
	private float mRadius;
	public SpotAnimation(int bgcolor, float radius) {
		super(bgcolor);
		
		mRadius = radius;
		mPaintColor.setStyle(Style.FILL);
	}

	@Override
	public void afterAnim(Canvas canvas) {
		if (mOffset >= mRadius * 2)
			mOffset = 0;
	}

	@Override
	public void beforeAnim(Canvas canvas) {
		float height = getBounds().height() / mRadius + mRadius * 2;
		float width = getBounds().width() / mRadius;
		
		for (int i = 0; i < height;i+=2){
			for (int j = 0; j < width;j+=2) {
				if (i % 2 == 0)
					canvas.drawCircle(j * mRadius + mRadius, i * mRadius + mRadius - mOffset, mRadius, mPaintColor);
				else
					canvas.drawCircle(j * mRadius + mRadius, i * mRadius -mOffset, mRadius, mPaintColor);
			}
		}		
	}

	@Override
	public AnimationList getAnimation() {
		return AnimationList.Spot;
	}
}
