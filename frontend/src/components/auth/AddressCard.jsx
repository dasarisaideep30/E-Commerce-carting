import PropTypes from 'prop-types';
import { MapPin, Globe, Landmark, Tag } from 'lucide-react';

export default function AddressCard({
	_id,
	country,
	city,
	address1,
	address2,
	zipCode,
	addressType,
}) {
	return (
		<div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl hover:bg-neutral-900 hover:border-indigo-500/30 transition-all group">
			<div className="flex items-start justify-between mb-4">
				<div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
					<MapPin size={20} />
				</div>
				<span className="px-2.5 py-1 bg-white/5 text-neutral-400 text-[10px] font-bold uppercase tracking-wider rounded-md border border-white/5 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-colors">
					{addressType || 'Default'}
				</span>
			</div>
			
			<div className="space-y-4">
				<div>
					<p className="text-xs text-neutral-500 font-medium uppercase tracking-tight mb-1">Street Address</p>
					<p className="text-white text-sm font-medium leading-relaxed truncate">{address1}</p>
					{address2 && <p className="text-neutral-400 text-xs mt-0.5 truncate">{address2}</p>}
				</div>
				
				<div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
					<div>
						<p className="text-xs text-neutral-500 font-medium uppercase tracking-tight mb-1">City</p>
						<p className="text-white text-sm font-medium">{city}</p>
					</div>
					<div>
						<p className="text-xs text-neutral-500 font-medium uppercase tracking-tight mb-1">Zip Code</p>
						<p className="text-white text-sm font-medium">{zipCode}</p>
					</div>
				</div>

				<div className="pt-2">
					<p className="text-xs text-neutral-500 font-medium uppercase tracking-tight mb-1">Country</p>
					<div className="flex items-center space-x-2 text-neutral-300">
						<Globe size={14} className="text-indigo-400" />
						<span className="text-sm">{country}</span>
					</div>
				</div>
			</div>
		</div>
	);
}

AddressCard.propTypes = {
	_id: PropTypes.string.isRequired,
	country: PropTypes.string.isRequired,
	city: PropTypes.string.isRequired,
	address1: PropTypes.string.isRequired,
	address2: PropTypes.string,
	zipCode: PropTypes.number.isRequired,
	addressType: PropTypes.string.isRequired
};