package com.zerotwoone.talkingabc;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.FragmentManager;
import android.content.Context;
import android.media.AudioManager;
import android.media.SoundPool;
import android.os.Build;
import android.util.SparseIntArray;

import com.zerotwoone.talkingabc.dialog.LoadingDialog;
import en.com.zerotwoone.abclearning.R;

public abstract class BaseSoundClass implements Runnable {

	protected SoundPool mSoundPool;
	protected SparseIntArray mSoundData = new SparseIntArray();

	protected Context mContext;
	private boolean hasExclaim;

	@SuppressWarnings("deprecation")
	@TargetApi(Build.VERSION_CODES.LOLLIPOP)
	public BaseSoundClass(Context context, boolean hasexclamation,
			int maxStreams, boolean async) {
		mContext = context;
		hasExclaim = hasexclamation;

		((Activity) mContext).getFragmentManager().popBackStack("LoadStack",
				FragmentManager.POP_BACK_STACK_INCLUSIVE);

		((Activity) mContext).getFragmentManager().beginTransaction()
				.add(android.R.id.content, new LoadingDialog(), "Load")
				.addToBackStack("LoadStack").commit();

		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
			mSoundPool = new SoundPool.Builder().setMaxStreams(maxStreams)
					.build();
		else
			mSoundPool = new SoundPool(maxStreams, AudioManager.STREAM_MUSIC, 0);

		if (async)
			new Thread(this).start();
		else
			this.run();
	}

	public BaseSoundClass(Context context, boolean hasexclamation,
			int maxStreams) {
		this(context, hasexclamation, maxStreams, false);
	}

	protected abstract void loadsound();

	public void load(int id) {
		mSoundData.put(id, mSoundPool.load(mContext, id, 0));
	}

	public void unload(int id) {
		if (mSoundData.get(id) != 0) {
			mSoundPool.unload(mSoundData.get(id));
			mSoundData.removeAt(mSoundData.indexOfKey(id));
		}
	}

	public void play(int id) {
		if (mSoundData.get(id) != 0)
			mSoundPool.play(mSoundData.get(id), 1, 1, 0, 0, 1);
	}

	public void playExclaim() {
		if (hasExclaim)
			play(Static.getRandomExclaim());
	}

	public void destroy() {
		mSoundData.clear();
		mSoundPool.release();
	}

	@Override
	public void run() {
		if (hasExclaim) {
			load(R.raw.hooray);
			load(R.raw.yeah);
			load(R.raw.wonderful);
			load(R.raw.cool);
			load(R.raw.wow);
			load(R.raw.bravo);
			load(R.raw.great);
		}

		loadsound();

		try {
			((Activity) mContext).getFragmentManager().popBackStack();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
