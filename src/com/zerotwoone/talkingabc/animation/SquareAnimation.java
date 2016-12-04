package com.zerotwoone.talkingabc.animation;

import android.graphics.Canvas;
import android.graphics.RectF;

public class SquareAnimation extends BaseAnimationDrawable {

	private float mSquareSize;

	public SquareAnimation(int bgcolor, float square) {
		super(bgcolor);

		mSquareSize = square;
		mPaintColor.setStrokeWidth(10f);
	}

	@Override
	public void afterAnim(Canvas canvas) {
		if (mOffset >= 90)
			mOffset = 0;
	}

	@Override
	public void beforeAnim(Canvas canvas) {
		for (float i = 0; i <= getBounds().width() / mSquareSize; i += 1.5f) {
			for (float j = 0; j <= (getBounds().height() + mSquareSize)
					/ mSquareSize; j += 1.5f) {
				canvas.save();
				RectF rect = new RectF(i * mSquareSize, j * mSquareSize, i
						* mSquareSize + mSquareSize, j * mSquareSize
						+ mSquareSize);
				canvas.rotate(mOffset, rect.centerX(), rect.centerY());
				canvas.drawRect(rect, mPaintColor);
				canvas.restore();
			}
		}
	}

	@Override
	public AnimationList getAnimation() {
		return AnimationList.Square;
	}
}
