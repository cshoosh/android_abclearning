package com.zerotwoone.talkingabc.animation;

import android.graphics.Canvas;

public class LineBackgroundAnimation extends BaseAnimationDrawable {

	private float mWidth;

	public LineBackgroundAnimation(int bgcolor, float width) {
		super(bgcolor);

		mWidth = width;
		mPaintColor.setStrokeWidth(mWidth);
	}

	@Override
	public void afterAnim(Canvas canvas) {
		if (mOffset >= mWidth * 2)
			mOffset = 0;
	}

	@Override
	public void beforeAnim(Canvas canvas) {
		for (int i = 0; i <= (getBounds().height() + mWidth * 2) / mWidth; i += 2) {
			canvas.drawLine(0, (i * mWidth) - mOffset, getBounds().width(),
					(i * mWidth) - mOffset, mPaintColor);
		}
	}

	@Override
	public AnimationList getAnimation() {
		return AnimationList.Line;
	}

}
