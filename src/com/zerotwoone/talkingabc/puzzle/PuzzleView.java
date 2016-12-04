package com.zerotwoone.talkingabc.puzzle;

import java.util.Random;

import android.app.Activity;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.util.AttributeSet;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.animation.Animation;
import android.view.animation.Animation.AnimationListener;
import android.view.animation.RotateAnimation;
import android.widget.ImageView;

import en.com.zerotwoone.abclearning.R;
import com.zerotwoone.talkingabc.animation.BaseAnimationDrawable;

public class PuzzleView extends ImageView implements OnClickListener {
	private static final Paint mBorderPaint = new Paint();
	static {
		mBorderPaint.setColor(Color.BLACK);
		mBorderPaint.setStrokeWidth(2f);
		mBorderPaint.setStyle(Style.STROKE);
	}

	private float mRotation;
	private PuzzleCallback mCallback;
	private BaseAnimationDrawable mBaseAnimation;
	private int[] mLocation = new int[2];
	private boolean isSolved, isStarted;

	public PuzzleView(Context context, AttributeSet attrs) {
		super(context, attrs);
		init(context);
	}

	public PuzzleView(Context context) {
		super(context);
		init(context);
	}

	private void init(Context context) {
		mCallback = (PuzzleCallback) ((Activity) context).getFragmentManager()
				.findFragmentById(android.R.id.content);
		mCallback.setPuzzleView(this);

		setOnClickListener(this);
		setSoundEffectsEnabled(false);

		int rand = new Random().nextInt(3);
		final int rot = rand == 0 ? 90 : rand == 1 ? 180 : 270;
		
		postDelayed(new Runnable() {
			
			@Override
			public void run() {
				setPuzzleRotation(rot);
				isStarted = true;
			}
		}, 1500);
		
	}

	@Override
	protected void onDraw(Canvas canvas) {

		if (mBaseAnimation != null && !isSolved) {
			canvas.save();
			canvas.translate(-mLocation[0], -mLocation[1]);
			mBaseAnimation.draw(canvas);
			canvas.restore();
		}

		super.onDraw(canvas);
		if (!isSolved)
			canvas.drawRect(0, 0, getWidth(), getHeight(), mBorderPaint);
	}

	public void setBaseAnimationDrawable(BaseAnimationDrawable drawable) {
		mBaseAnimation = drawable;
		getLocationInWindow(mLocation);
	}

	public void setSolved(boolean isSolved) {
		this.isSolved = isSolved;
		invalidate();
	}
	
	public boolean isSolved() {
		return this.isSolved;
	}
	
	public void setPuzzleRotation(float rotation) {
		final int DURATION = 350;

		RotateAnimation rotateanim = new RotateAnimation(mRotation,
				mRotation = rotation, Animation.RELATIVE_TO_SELF, 0.5f,
				Animation.RELATIVE_TO_SELF, 0.5f);
		
		rotateanim.setDuration(DURATION);
		rotateanim.setFillAfter(true);
		startAnimation(rotateanim);

		rotateanim.setAnimationListener(new AnimationListener() {
			@Override	public void onAnimationStart(Animation animation) {} 
			@Override	public void onAnimationRepeat(Animation animation) {}

			@Override
			public void onAnimationEnd(Animation animation) {
				if (mCallback != null)
					mCallback.isSolved();
			}
		});
		
		if (mRotation == 360)
			mRotation = 0;
	}

	public float getPuzzleRotation() {
		return mRotation;
	}

	@Override
	public void onClick(View v) {

		if (getAnimation() != null && getAnimation().hasEnded() && !isSolved && isStarted) {
			setPuzzleRotation(mRotation + 90);
			mCallback.playSound(R.raw.lego_click);
		}
	}
}
