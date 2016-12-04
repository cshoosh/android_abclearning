package com.zerotwoone.talkingabc.puzzle;

public interface PuzzleCallback {
	public abstract void isSolved();
	public abstract void setPuzzleView(PuzzleView view);
	public abstract void playSound (int id);
}
