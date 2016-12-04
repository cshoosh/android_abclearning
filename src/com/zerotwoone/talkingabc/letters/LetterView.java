package com.zerotwoone.talkingabc.letters;

import android.content.Context;
import android.content.res.TypedArray;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Paint.Align;
import android.graphics.Paint.Style;
import android.graphics.RadialGradient;
import android.graphics.Shader.TileMode;
import android.util.AttributeSet;
import android.view.View;
import android.view.View.OnClickListener;

import en.com.zerotwoone.abclearning.R;
import com.zerotwoone.talkingabc.Static;

public class LetterView extends View implements OnClickListener {
	
	private static final Paint mTextPaint = new Paint();
	
	static {
		mTextPaint.setTextAlign(Align.CENTER);
		mTextPaint.setColor(Static.TRANSPARENT_WHITE);
		mTextPaint.setAlpha(200);
		mTextPaint.setTextSize(48f);
	}
	
	private String mLetter;
	private LetterCallback mCallback;
	private int mParentDrawable;
	
	private int mGradientColor;
	private Paint mBgPaint;

	public LetterView(Context context, AttributeSet attrs) {
		super(context, attrs);
		
		TypedArray array = context.getTheme().obtainStyledAttributes(attrs, R.styleable.letterview, 0, 0);
		
		try {
			
			//mAnimation = AnimationList.values()[array.getInt(R.styleable.letterview_letter_animation, 0)];
			mGradientColor = array.getColor(R.styleable.letterview_letter_gradient, 
					getResources().getColor(R.color.purple));
			
			mLetter = array.getString(R.styleable.letterview_letter);
			mLetter = mLetter != null ? mLetter : "A";
			
			mParentDrawable = array.getResourceId(R.styleable.letterview_letter_bg, R.drawable.a_wave);
			
		} finally {
			array.recycle();
		}
		
		init(context);
	}

	public LetterView(Context context) {
		super(context);
		init(context);
	}

	private void init(Context context) {
		mCallback = (LetterCallback) context;
		setOnClickListener(this);
		
		mBgPaint = new Paint();
		mBgPaint.setStyle(Style.FILL);
		
		mTextPaint.setTypeface(Static.CUBANO);
		
		post(new Runnable() {
			
			@Override
			public void run() {
				RadialGradient gradient = new RadialGradient(getWidth() / 2f, getHeight() / 2f, 
						getWidth(), mGradientColor, Static.darken(mGradientColor, 0.5f), TileMode.MIRROR);
				mBgPaint.setShader(gradient);
				invalidate();
			}
		});
	}
	@Override
	public void onClick(View v) {
		if (!mCallback.isParentAnimating()) 
			mCallback.LetterChangeParent(mParentDrawable, mLetter, mGradientColor);
	}
		
	
	@Override
	protected void onDraw(Canvas canvas) {
		super.onDraw(canvas);
		canvas.drawPaint(mBgPaint);
		canvas.drawText(mLetter, canvas.getWidth()/2f,
				(canvas.getHeight() / 2f) - 
				((mTextPaint.ascent() + mTextPaint.descent()) / 2f), mTextPaint);
	}

}
