package com.zerotwoone.talkingabc.animation;

import android.graphics.Canvas;
import android.graphics.Paint.Cap;
import android.graphics.Paint.Join;
import android.graphics.Path;
import android.graphics.Rect;

public class ZigZagAnimation extends BaseAnimationDrawable {

	private float mLength, mGap;
	private Path mZigZag;

	public ZigZagAnimation(int bgcolor, float length, float gap) {
		super(bgcolor);
		mLength = length;
		mGap = gap;

		mPaintColor.setAntiAlias(true);
		mPaintColor.setStrokeWidth(14f);

		mPaintColor.setStrokeCap(Cap.ROUND);
		mPaintColor.setStrokeJoin(Join.ROUND);

		mZigZag = new Path();
	}

	@Override
	protected void onBoundsChange(Rect bounds) {
		super.onBoundsChange(bounds);
		mZigZag.reset();

		mZigZag.moveTo(-mLength, mGap);
		for (int j = -1; j < bounds.width() / mLength; j++) {
			mZigZag.lineTo(j * mLength, mGap);
			mZigZag.lineTo(j * mLength + mLength / 2f, 0);
			mZigZag.lineTo(j * mLength + mLength, mGap);
		}
	}

	@Override
	public void afterAnim(Canvas canvas) {
		if (mOffset >= mLength)
			mOffset = 0;
	}

	@Override
	public void beforeAnim(Canvas canvas) {
		for (float i = 0.7f; i <= getBounds().height() / mGap; i += 2) {
			canvas.save();
			canvas.translate(mOffset, i * mGap);
			canvas.drawPath(mZigZag, mPaintColor);
			canvas.restore();
		}
	}

	@Override
	public AnimationList getAnimation() {
		return AnimationList.ZigZag;
	}
}
