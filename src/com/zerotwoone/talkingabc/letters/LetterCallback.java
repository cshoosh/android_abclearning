package com.zerotwoone.talkingabc.letters;

public interface LetterCallback {
	public abstract void LetterClick(String letter);

	public abstract void LetterChangeParent(int resource, String letter, int color);
	
	public abstract boolean isParentAnimating();
}
