import Button from 'react-bootstrap/button';

const GrowthPoints = ({growthPoints}) => {
	return (
		<div>
			<Button disabled={true}>{growthPoints}</Button>
		</div>
	);
};

export default GrowthPoints;
